import express from "express";
import { sendOtp, verifyOtp, getMe } from "../controllers/auth.controller";
import { protect, protectOptional } from "../middleware/auth.middleware";
import { createRazorpayOrder } from "../controllers/order.controller";

const router = express.Router();

router.post("/send-otp", protectOptional, sendOtp);
router.post("/verify-otp", protectOptional, verifyOtp);
router.get("/me", protect, getMe); // 
router.post("/create-razorpay-order", createRazorpayOrder);

export default router;