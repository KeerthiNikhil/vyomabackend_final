import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { placeOrder, createRazorpayOrder } from "../controllers/order.controller.js";
import { verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;