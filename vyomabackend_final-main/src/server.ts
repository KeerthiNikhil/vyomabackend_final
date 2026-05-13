import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import searchRoutes from "./routes/search.routes.js";
import deliveryBoyRoutes from "./routes/deliveryBoy.routes.js";

import { protect } from "./middleware/auth.middleware.js";
import { restrictTo } from "./middleware/restrict.middleware.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import wishlistRoutes from "./routes/wishlist.routes";

import addressRoutes from "./routes/address.routes.js";


const app = express();

/* ================= SECURITY MIDDLEWARE ================= */

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);// security headers

app.use(morgan("dev")); // request logs

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);


/* ================= RATE LIMITING ================= */

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: "Too many OTP requests. Try again later.",
});

app.use("/api/v1/auth/send-otp", otpLimiter);

/* ================= ROUTES ================= */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/shops", shopRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/delivery-boys", deliveryBoyRoutes);

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/address", addressRoutes);

/* ================= PROTECTED ROUTE ================= */

app.get(
  "/api/admin-only",
  protect,
  restrictTo("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 🚀" });
  }
);

/* ================= HEALTH CHECK ================= */

app.get("/", (_req, res) => {
  res.json({ message: "Marketplace API Running 🚀" });
});

/* ================= DB CONNECTION ================= */

const PORT = process.env.PORT || 8000;
console.log("ENV CHECK 👉", process.env.RAZORPAY_KEY_ID);

app.use("/api/v1/orders", (req, res, next) => {
  console.log("📦 ORDERS ROUTE HIT:", req.method, req.url);
  next();
});

app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed ❌", err);
  });