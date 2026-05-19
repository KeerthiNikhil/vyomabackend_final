import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Razorpay from "razorpay";
import crypto from "crypto";
import Shop from "../models/shop.model";

console.log("KEY_ID 👉", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET 👉", process.env.RAZORPAY_KEY_SECRET);

// ================= CREATE RAZORPAY ORDER =================
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("RAZORPAY ERROR 👉", err);

    res.status(500).json({
      success: false,
      message: err?.error?.description || err.message || "Razorpay failed",
    });
  }
};

// ================= PLACE ORDER (ONLY COD) =================
export const placeOrder = async (req, res) => {

  try {

    const {
      paymentMethod,
      totalAmount,
      deliveryCharge,
      shippingAddress,
      items,
    } = req.body;

    if (paymentMethod !== "COD") {

      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });

    }

    if (!items || items.length === 0) {

      return res.status(400).json({
        success: false,
        message: "No items found",
      });

    }

    const products = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    // ✅ VERY IMPORTANT
    const shop = items[0]?.shop;

    const order = await Order.create({

      user: req.user.id,

      shop,

      products,

      totalAmount,

      deliveryCharge,

      shippingAddress,

      paymentMethod,

      paymentStatus: "Pending",

      status: "pending",

    });

    // CLEAR CART
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (cart) {

      cart.items = [];

      await cart.save();

    }

    res.json({
      success: true,
      order,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Order failed",
    });

  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      totalAmount,
      deliveryCharge,
      shippingAddress,
      items,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {

      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });

    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !== razorpay_signature
    ) {

      return res.status(400).json({
        success: false,
        message: "Signature mismatch ❌",
      });

    }

    let payment;

    try {

      payment = await razorpay.payments.fetch(
        razorpay_payment_id
      );

    } catch (err) {

      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });

    }

    if (payment.status !== "captured") {

      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });

    }

    const products = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const shop = items[0]?.shop;

    await Order.create({

      user: req.user.id,

      shop,

      products,

      totalAmount,

      deliveryCharge,

      shippingAddress,

      paymentMethod: "ONLINE",

      paymentId: razorpay_payment_id,

      status: "pending",

    });

    // CLEAR CART
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (cart) {

      cart.items = [];

      await cart.save();

    }

    return res.json({
      success: true,
      message: "Payment verified ✅",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Verification failed ❌",
    });

  }
};
export const getOrders = async (req, res) => {

  try {

    // vendor shop
    const shop = await Shop.find({
      owner: req.user.id,
    });

    if (!shop) {

      return res.json({
        success: true,
        data: [],
      });

    }

    // only vendor shop orders
    const orders = await Order.find({
      shop: shop._id,
    })
      .populate("user", "name email")
      .populate({
  path: "products.product",
  select: "name images price",
})
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });

  }
};

export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user.id,
    })
      .populate({
  path: "products.product",
  select: "name images price",
})
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });

  }
};
export const getVendorOrders = async (req, res) => {

  try {

    const vendorId = req.user.id;

    // ALL vendor shops
    const shops = await Shop.find({
      owner: vendorId,
    });

    // no shops
    if (!shops || shops.length === 0) {

      return res.status(200).json({
        success: true,
        data: [],
      });

    }

    // all shop ids
    const shopIds = shops.map(
      (shop) => shop._id
    );

    console.log("SHOP IDS =", shopIds);

    // fetch orders of all shops
    const orders = await Order.find({
      shop: { $in: shopIds },
    })
      .populate("user", "name email")
      .populate({
        path: "products.product",
        select: "name images price shop",
      })
      .sort({ createdAt: -1 });

    console.log(
      "TOTAL ORDERS =",
      orders.length
    );

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor orders",
    });

  }

};