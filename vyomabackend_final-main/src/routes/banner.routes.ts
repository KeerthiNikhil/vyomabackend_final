import express from "express";

import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { restrictTo, restrictToVendor } from "../middleware/restrict.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  createBanner
);

router.get("/", getBanners);

router.put(
  "/:id",
  upload.single("image"),
  updateBanner
);

router.delete(
  "/:id",
  
  deleteBanner
);

export default router;