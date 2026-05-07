import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  image: { type: String },

  status: {
    type: String,
    enum: ["Available","On Delivery","Offline"],
    default: "Available"
  },

  rating: { type: Number, default: 4.5 },

  assignedOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },

  pendingPayment: { type: Number, default: 0 },

  earningsToday: { type: Number, default: 0 },

  attendanceDays: { type: Number, default: 0 },

  /* REALTIME LOCATION */

  location: {
    lat: Number,
    lng: Number
  },

  /* SALARY SETTINGS */

  baseSalary: { type: Number, default: 8000 },
  perDeliveryAmount: { type: Number, default: 20 }

},
{ timestamps: true }
);

export default mongoose.model("DeliveryBoy", deliveryBoySchema);