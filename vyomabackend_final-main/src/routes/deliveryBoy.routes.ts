import express from "express";
import { protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import { updateLocation } from "../controllers/deliveryBoy.controller";

import {
  createDeliveryBoy,
  getDeliveryBoys,
  deleteDeliveryBoy,
  markAttendance
} from "../controllers/deliveryBoy.controller";

const router = express.Router();

/* CREATE DELIVERY BOY */

router.post(
  "/",
  protect,
  upload.single("image"),
  createDeliveryBoy
);

/* GET DELIVERY BOYS */

router.get(
  "/",
  protect,
  getDeliveryBoys
);

/* DELETE DELIVERY BOY */

router.delete(
  "/:id",
  protect,
  deleteDeliveryBoy
);

router.patch(
"/update-location/:id",
protect,
updateLocation
);

router.post(
"/mark-attendance/:id",
protect,
markAttendance
);
export default router;