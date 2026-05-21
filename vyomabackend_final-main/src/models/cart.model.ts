import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  originalPrice: {
  type: Number,
  default: 0,
}, 
  image: String,
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  quantity: Number,
  deliveryFee: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);