import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { placeOrder, createRazorpayOrder } from "../controllers/order.controller.js";
import { verifyPayment } from "../controllers/order.controller.js";
import {
  getMyOrders,
} from "../controllers/order.controller";
const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

export default router;