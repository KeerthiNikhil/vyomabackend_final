import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/restrict.middleware.js";
import { adminLogin,
  getDashboard,
  getVendors,
  getBanners,
  getPayments,
  getReviews, } from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", adminLogin);

// 🔒 PROTECTED
router.get("/dashboard", adminAuth, getDashboard);
router.get("/vendors", adminAuth, getVendors);
router.get("/banners", adminAuth, getBanners);
router.get("/payments", adminAuth, getPayments);
router.get("/reviews", adminAuth, getReviews);

export default router;