import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {

  user: mongoose.Types.ObjectId;

  shop: mongoose.Types.ObjectId;

  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;

  deliveryCharge: number;

  paymentMethod: "COD" | "ONLINE";

  paymentId?: string;

  shippingAddress: {
    name: string;
    phone: string;
    house: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };

 status:
  | "pending"
  | "delivered"
  | "cancelled";
}

const orderSchema = new Schema<IOrder>(
  {

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: false,
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: Number,

        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    paymentId: {
      type: String,
    },

    shippingAddress: {
      name: String,
      phone: String,
      house: String,
      area: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
    },

    status: {
      type: String,
      enum: [
  "pending",
  "delivered",
  "cancelled",
],

default: "pending",
    },
  },

  { timestamps: true }
);

const Order = mongoose.model<IOrder>(
  "Order",
  orderSchema
);

export default Order;