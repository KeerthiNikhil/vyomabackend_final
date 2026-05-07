import mongoose, { Schema, Document } from "mongoose";

export interface IShop extends Document {
  owner: mongoose.Types.ObjectId;
  shopName: string;
  ownerName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  description?: string;

  gstNumber?: string;
  udyamNumber?: string;
  fssaiNumber?: string;
  tradeLicenseNumber?: string;

  shopImage?: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    description: String,

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    gstNumber: String,
    udyamNumber: String,
    fssaiNumber: String,
    tradeLicenseNumber: String,

    shopImages: [String],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

shopSchema.index({ location: "2dsphere" });

export default mongoose.model<IShop>("Shop", shopSchema);