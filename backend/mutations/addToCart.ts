import { KeystoneContext } from "@keystone-6/core/types";

export default async function addToCart(
  root: any,
  { productId }: any,
  context: any,
): Promise<any> {
  // Query the current user see if it signed in
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // Query the current user cart
  const allCartItems = await context.db.CartItem.findMany({
    where: {
      user: { id: { equals: sesh.itemId } },
      product: { id: { equals: productId } },
    },
  });
  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    return await context.db.CartItem.updateOne({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return await context.db.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    }
  })
}
