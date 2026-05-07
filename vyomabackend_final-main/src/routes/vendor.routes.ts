import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { getMyProfile,updateMyProfile } from "../controllers/vendor.controller.js";
import { upload } from "../controllers/vendor.controller.js";
const router = express.Router();

router.put("/become-vendor", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.role = "vendor";
    await user.save();

    // 🔥 CREATE NEW TOKEN WITH UPDATED ROLE
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Now vendor",
      token, // ✅ NEW TOKEN
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Error upgrading" });
  }
});

router.put(
  "/profile",
  protect,
  upload.single("avatar"),   // 👈 VERY IMPORTANT
  updateMyProfile
);
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

export default router;