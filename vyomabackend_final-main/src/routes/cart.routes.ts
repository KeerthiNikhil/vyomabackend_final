import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCart,
  removeItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCart);
router.delete("/:productId", protect, removeItem);

export default router;