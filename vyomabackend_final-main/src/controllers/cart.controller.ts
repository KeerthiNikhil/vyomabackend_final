import Cart from "../models/cart.model.js";

// GET CART
export const getCart = async (req: any, res: any) => {
  const cart = await Cart.findOne({ user: req.user.id });

  res.json({
    success: true,
    data: cart?.items || [],
  });
};

// ADD TO CART
export const addToCart = async (req: any, res: any) => {
  const { productId, name, price, image,shop } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const existing = cart.items.find(
    (item: any) => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({
         productId, name, 
      price, image,shop, quantity: 1 });
  }

  await cart.save();

  res.json({ success: true, data: cart.items });
};

// UPDATE QTY
export const updateCart = async (req: any, res: any) => {
  const { productId, type } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  const item = cart.items.find(
    (i: any) => i.productId.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Not found" });

  if (type === "inc") item.quantity += 1;
  if (type === "dec") item.quantity -= 1;

  cart.items = cart.items.filter((i: any) => i.quantity > 0);

  await cart.save();

  res.json({ success: true, data: cart.items });
};

// REMOVE
export const removeItem = async (req: any, res: any) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  cart.items = cart.items.filter(
    (i: any) => i.productId.toString() !== productId
  );

  await cart.save();

  res.json({ success: true, data: cart.items });
};
