import express from "express";
import { protect } from "../middleware/auth.middleware";
import upload  from "../middleware/upload.middleware";

import {
  createShop,
  getMyShops,
  addShopImages
} from "../controllers/shop.controller";

import Shop from "../models/shop.model";
import { getVendorShops } from "../controllers/shop.controller";
import { restrictToVendor } from "../middleware/restrict.middleware";

const router = express.Router();

/* CREATE SHOP */

router.post(
  "/create",
  protect,
  restrictToVendor,
  upload.array("shopImages", 3),
  createShop
);

/* GET MY SHOPS */


/* GET ALL SHOPS */

router.get("/", async (_req, res) => {
  try {

    const shops = await Shop.find();

    res.json({
      success: true,
      data: shops
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

/* NEARBY SHOPS */

router.get("/nearby", async (req, res) => {
  try {

    const { lat, lng } = req.query;

    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(lng as string),
              parseFloat(lat as string),
            ],
          },
          $maxDistance: 5000,
        },
      },
    });

    res.json({
      success: true,
      data: shops,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

router.get(
  "/my-shops",
  protect,
  getVendorShops
);

router.get("/:shopId", async (req, res) => {
  try {

    const shop = await Shop.findById(req.params.shopId);

    res.json({
      success: true,
      data: shop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

router.post(
  "/:id/add-images",
  protect, // ✅ fix this
  upload.array("shopImages", 3),
  addShopImages
);

export default router;