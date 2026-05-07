import express from "express";
import { protect } from "../middleware/auth.middleware";
import upload  from "../middleware/upload.middleware";
import multer from "multer";

import {
  createProduct,
  getProductsByShop,
  deleteProduct,
  getCategoryAnalytics
} from "../controllers/product.controller";
import { getVendorProducts } from "../controllers/product.controller";
import { bulkUploadProducts } from "../controllers/product.controller";
import { getProductById } from "../controllers/product.controller";
import { updateProduct } from "../controllers/product.controller";
import Product from "../models/product.model";

const router = express.Router();

/* CREATE PRODUCT */

router.post(
  "/",
  protect,
  upload.array("images", 4),
  createProduct
);

/* PRODUCTS BY SHOP */
router.get("/shop/:shopId", getProductsByShop);

router.get("/vendor-products", protect, getVendorProducts);

router.get("/analytics", protect, getCategoryAnalytics);

/* PRODUCT BY ID → ALWAYS KEEP LAST */
router.get("/:id", getProductById);
/* GET ALL PRODUCTS */
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find();

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* DELETE */
router.delete("/:productId", protect, deleteProduct);

router.put("/:id", protect, updateProduct);

router.post("/bulk-upload", upload.single("file"), bulkUploadProducts);

export default router;