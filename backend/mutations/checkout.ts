import stripeConfig from "../lib/stripe";

const graphql = String.raw;

export default async function checkout(
  root: any,
  { token }: any,
  context: any,
): Promise<any> {

  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!');
  }

  // 2. Query the current user
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              url
            }
          }
        }
      }
    `,
  });

  // 3. Calculate the total price for their order
  const cartItems = user.cart.filter((cartItem: any) => cartItem.product);
  const amount = cartItems.reduce((tally: number, cartItem: any) => {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);

  // 4. Create the charge with the Stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });

  // 5. Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem: any) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }
    return orderItem;
  });

  // 6. Create the order and return it
  const order = await context.db.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      item: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  // 6. Clean up any old cart item
  const cartItemIds = cartItems.map((cartItem: any) => cartItem.id);
  for (let i = 0; i < cartItemIds.length; i++) {
    await context.query.CartItem.deleteOne({
      where: { id: cartItemIds[i] }
    });
  }
  return order;
}
