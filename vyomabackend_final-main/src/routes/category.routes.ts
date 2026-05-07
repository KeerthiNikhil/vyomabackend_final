import express from "express";
import {
  createCategory,
  getMyCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.middleware";
const router = express.Router();

// 🔐 protected routes
router.post("/", protect, createCategory);
router.get("/my", protect, getMyCategories);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;