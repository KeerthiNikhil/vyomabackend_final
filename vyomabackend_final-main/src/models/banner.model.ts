import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    subtitle: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    redirectType: {
      type: String,
      enum: [
        "product",
        "category",
        "shop",
        "external",
        "none",
      ],
      default: "none",
    },

    redirectValue: {
      type: String,
    },

    position: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    platform: {
      type: String,
      enum: ["mobile", "website", "both"],
      default: "both",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Banner",
  bannerSchema
);