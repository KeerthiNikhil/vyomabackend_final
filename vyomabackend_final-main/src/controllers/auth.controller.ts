import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";



// ✅ PHONE VALIDATION
const isValidPhone = (phone: string) => {
  return /^[6-9]\d{9}$/.test(phone);
};

// ✅ SEND OTP
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone, type,name} = req.body;
    console.log("🔥 BODY:", req.body);

    console.log("REQ BODY:", req.body);
    
    // ✅ VALIDATE PHONE FIRST
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    // =========================
    // 🔓 USER LOGIN FLOW
    // =========================
    if (type === "user") {
      let user = await User.findOne({ phone });

      if (!user) {
  user = await User.create({
    phone,
    name: name || "User", // ✅ FIX
    role: "user",
  });
}

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await user.save();

      console.log("🔥 LOGIN OTP:", otp);

      return res.json({
        success: true,
        message: "OTP sent",
      });
    }

    // =========================
    // 🔐 VENDOR FLOW
    // =========================
    if (type === "vendor") {
      if (!(req as any).user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const user = await User.findById((req as any).user.id);

      console.log("DB PHONE:", user?.phone);
      console.log("INPUT PHONE:", phone);

      const cleanInput = String(phone).trim();
const cleanDB = String(user?.phone).trim();

console.log("DB:", cleanDB);
console.log("INPUT:", cleanInput);

if (!user || cleanDB !== cleanInput) {
  return res.status(400).json({
    message: "Use your registered mobile number",
  });
}

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await user.save();

      console.log("🔥 VENDOR OTP:", otp);

      return res.json({
        success: true,
        message: "OTP sent",
      });
    }

    // =========================
    // ❌ INVALID TYPE
    // =========================
    return res.status(400).json({
      message: "Invalid request type",
    });

  } catch (error) {
    console.log("🔥 ERROR:", error);
    console.log("🔥 SEND OTP ERROR:", error);
    return res.status(500).json({
      message: "Error sending OTP",
    });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp, type } = req.body;

    const cleanPhone = String(phone).trim();

    if (!cleanPhone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP required",
      });
    }

    // 🔓 USER LOGIN FLOW
    if (!type || type === "user") {
      const user = await User.findOne({ phone: cleanPhone });

      if (!user || user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (user.otpExpiry && user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      const token = generateToken(user._id.toString());

      return res.json({ success: true, token, user });
    }

    // 🔐 VENDOR FLOW
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (String(user.phone).trim() !== cleanPhone) {
      return res.status(400).json({
        message: "Use your registered mobile number",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ UPGRADE TO VENDOR
    if (user.role !== "vendor") {
      user.role = "vendor";
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user,
      isVendor: true,
    });

  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// ✅ GET ME
export const getMe = async (req: any, res: any) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
    });
  }
};