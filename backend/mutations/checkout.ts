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
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  
  // 5. Convert the cartItems to OrderItems
  // 6. Create the order and return it
}
