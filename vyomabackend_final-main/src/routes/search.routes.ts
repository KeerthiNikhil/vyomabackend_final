import express from "express";
import Product from "../models/product.model";
import Shop from "../models/shop.model";

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" }
    }).limit(10);

    const shops = await Shop.find({
      shopName: { $regex: q, $options: "i" }
    }).limit(10);

    res.json({
      success: true,
      data: {
        products,
        shops
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

export default router;