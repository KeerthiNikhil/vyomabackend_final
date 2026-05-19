import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  placeOrder,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getVendorOrders,
} from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get(
  "/my-orders",
  protect,
  getMyOrders
);
router.get(
  "/vendor-orders",
  protect,
  getVendorOrders
);
export default router;