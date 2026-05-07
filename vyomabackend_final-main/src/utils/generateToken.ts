import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  return jwt.sign(
    { id }, // ✅ ONLY ID
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};