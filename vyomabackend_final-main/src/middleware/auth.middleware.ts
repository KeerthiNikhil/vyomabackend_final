import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";


export const protect = async (req: any, res: any, next: any) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - no token",
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("DECODED:", decoded);

    // middleware/auth.middleware.js

req.user = await User.findById(decoded.id);

if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "User not found",
  });
}
    next();
  } catch (error) {
    console.log("JWT ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - invalid token",
    });
  }
  console.log("USER:", req.user);
};

export const restrictTo = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }
    next();
  };
};

export const adminAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded: any = jwt.verify(token, "SECRET_KEY");

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not admin" });
    }

    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const protectOptional = async (req: any, res: any, next: any) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = await User.findById(decoded.id);
    }

    next();
  } catch (error) {
    next();
  }
};