import { Request, Response } from "express";
import User from "../models/user.model";

// ➕ ADD TO WISHLIST
export const addToWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

// ❌ REMOVE
export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id: any) => id.toString() !== productId
    );

    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing" });
  }
};

// 📥 GET WISHLIST
export const getWishlist = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json({
      success: true,
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};