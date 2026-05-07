import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  saveAddress,
  getAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", protect, saveAddress);
router.get("/", protect, getAddress);

export default router;