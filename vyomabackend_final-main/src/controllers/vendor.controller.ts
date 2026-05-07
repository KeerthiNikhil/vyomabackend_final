import multer from "multer";
import Shop from "../models/shop.model.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

export const createShop = async (req: any, res: any) => {
  try {
    const { name, description } = req.body;

    const shop = await Shop.create({
      name,
      description,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: shop,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/orders/:id/assign-delivery

export const assignDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      deliveryBoy,
      deliveryBoyId,
      distance,
      rate,
      totalDeliveryCost,
    } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        deliveryBoy,
        deliveryBoyId,
        deliveryStatus: "Assigned",
        deliveryCost: totalDeliveryCost,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = req.user;

    const shops = await Shop.find({ owner: user._id });

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        shops: shops.map((shop) => ({
          id: shop._id,
          name: shop.name,
          address: shop.address,
          description: shop.description,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
export const updateMyProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, phone, shopId, shopName, address } = req.body;

    // ✅ update user
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // ✅ avatar upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // ✅ update selected shop
    if (shopId) {
      const shop = await Shop.findById(shopId);

      if (shop) {
        shop.name = shopName || shop.name;
        shop.address = address || shop.address;
        await shop.save();
      }
    }

    res.json({
      success: true,
      message: "Profile updated",
    });

  } catch (error) {
    console.log("UPDATE ERROR 👉", error);
    res.status(500).json({ message: "Update failed" });
  }
};