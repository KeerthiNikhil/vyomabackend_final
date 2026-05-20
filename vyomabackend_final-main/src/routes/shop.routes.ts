import express from "express";
import { protect } from "../middleware/auth.middleware";

import {
  createShop,
  getMyShops,
  addShopImages,
  updateShop,
  toggleShopStatus,
  getVendorShops
} from "../controllers/shop.controller";

import Shop from "../models/shop.model";
import { restrictToVendor } from "../middleware/restrict.middleware";
import { upload } from "../middleware/upload";
import { getDistanceFromLatLonInKm }
from "../utils/distance";

const router = express.Router();

/* CREATE SHOP */

router.post(
  "/create",
  protect,
  upload.array("shopImages", 5),
  createShop
);

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

   const shops = await Shop.find();

const nearbyShops = shops.filter((shop) => {

  const [shopLng, shopLat] =
    shop.location.coordinates;

  const distanceInKm =
    getDistanceFromLatLonInKm(
      parseFloat(lat as string),
      parseFloat(lng as string),
      shopLat,
      shopLng
    );

  return (
    distanceInKm <=
    (shop.visibilityDistance || 10)
  );
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
router.put(
  "/:id",
  protect,
  upload.array("shopImages", 5),
  updateShop
);

router.put(
  "/:id/toggle-status",
  protect,
  toggleShopStatus
);
export default router;