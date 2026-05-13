import Shop from "../models/shop.model";
import User from "../models/user.model";

/* ================= CREATE SHOP ================= */

export const createShop = async (req: any, res: any) => {
  try {
    
    const files = req.files as Express.MulterS3.File[];

const imageUrls = files.map((file) => file.location);
    const userId = req.user._id;

    const {
      shopName,
      ownerName,
      businessType,
      description,
      email,
      phone,
      address,
      latitude,
      longitude,
      gstNumber,
      udyamNumber,
      fssaiNumber,
      tradeLicenseNumber
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    const shopImages = imageUrls || [];

    const shop = await Shop.create({
      owner: userId,
      shopName,
      ownerName,
      businessType,
      description,
      email,
      phone,
      address,
      gstNumber,
      udyamNumber,
      fssaiNumber,
      tradeLicenseNumber,
      shopImages,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      },
    });

    /* convert user role to vendor */
    await User.findByIdAndUpdate(userId, {
      role: "vendor",
    });

    res.status(201).json({
      success: true,
      data: shop,
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ================= GET VENDOR SHOPS ================= */

export const getMyShops = async (req: any, res: any) => {
  try {

    const shops = await Shop.find({
      owner: req.user._id
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
};

/* ================= GET SHOPS FOR DROPDOWN ================= */

export const getVendorShops = async (req: any, res: any) => {
  try {

    const shops = await Shop.find({
      owner: req.user._id
    }).select("_id shopName");

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
};

/* ================= GET SINGLE SHOP ================= */

export const getShopById = async (req: any, res: any) => {
  try {

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    res.json({
      success: true,
      data: shop
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/* ================= GET ALL SHOPS ================= */

export const getAllShops = async (req: any, res: any) => {
  try {

    const shops = await Shop.find().sort({ createdAt: -1 });

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
};

export const addShopImages = async (req, res) => {
  try {
    const shopId = req.params.id;

    const newImages = req.files.map(
  (file: any) => file.location
);

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // merge old + new images
    shop.shopImages = [...(shop.shopImages || []), ...newImages];

    await shop.save();

    res.json({
      message: "Images added successfully",
      data: shop,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images" });
  }
};