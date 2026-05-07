import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Razorpay from "razorpay";
import crypto from "crypto";

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
    const { paymentMethod } = req.body;

    // 🚨 BLOCK ONLINE ORDERS HERE
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const products = cart.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shop = cart.items[0]?.shop;

    if (!shop) {
      return res.status(400).json({
        message: "Shop not found in cart",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      shop,
      products,
      totalAmount,
      status: "pending",
    });

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Order placed successfully 🎉",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    console.log("🔥 VERIFY PAYMENT HIT");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      totalAmount,
    } = req.body;

    // ❌ Missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });
    }
console.log("FULL PAYMENT OBJECT 👉", payment);
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch ❌",
      });
    }

    // ✅ Fetch payment
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });
    }

    // ❌ NOT PAID
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed ❌",
      });
    }

    // ✅ CREATE ORDER ONLY AFTER PAYMENT
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const products = cart.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const shop = cart.items[0]?.shop;

    await Order.create({
      user: req.user.id,
      shop,
      products,
      totalAmount,
      paymentId: razorpay_payment_id,
      status: "paid",
    });

    cart.items = [];
    await cart.save();

    return res.json({
      success: true,
      message: "Payment verified ✅",
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Verification failed ❌",
    });
  }
};