import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model";
import { generateToken } from "../utils/generateToken";


export const getAdminDashboardStats = async (req, res) => {
  try {
    // Total Revenue (only delivered orders)
    const deliveredOrders = await Order.find({ status: "Delivered" });

    const totalRevenue = deliveredOrders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    // Active Products
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Total Reviews
    const totalReviews = await Review.countDocuments();

    // Active Vendors
    const activeVendors = await User.countDocuments({
      role: "vendor",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        activeProducts,
        totalReviews,
        activeVendors,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🔐 LOGIN
export const adminLogin = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin._id.toString());

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// 📊 DASHBOARD
export const getDashboard = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      data: {
        totalRevenue: 24580,
        activeProducts: 1248,
        totalReviews: 4872,
        activeVendors: 342,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// 👥 VENDORS
export const getVendors = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      data: [
        {
          _id: "1",
          businessName: "Tech Store",
          ownerName: "Rahul",
          email: "rahul@gmail.com",
          phone: "9999999999",
          products: 12,
          revenue: 50000,
          rating: 4.5,
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// 🎯 BANNERS
export const getBanners = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      data: [
        {
          _id: "1",
          title: "Big Sale",
          image: "https://via.placeholder.com/300",
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// 💳 PAYMENTS
export const getPayments = async (req: any, res: any) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        vendorName: "Tech Store",
        amount: 2500,
      },
    ],
  });
};

// ⭐ REVIEWS
export const getReviews = async (req: any, res: any) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        comment: "Great product",
        rating: 5,
      },
    ],
  });
};