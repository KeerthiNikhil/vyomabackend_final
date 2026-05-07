import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {

  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;

  discountType?: "percentage" | "flat";
  discountValue?: number;
  finalPrice?: number;

  shop: mongoose.Types.ObjectId;

  images: string[];

  /* ⭐ UNITS / VARIANTS */

  unitOptions?: {
  label: string;
  price: number;
}[];
productDetails?: {
  title: string;
  content: string;
}[];

  expiryDate?: Date;
  weight?: string;
  brand?: string;
  warranty?: string;
  modelNumber?: string;
  manufacturer?: string;
  skinType?: string;
  author?: string;
  ageGroup?: string;
  material?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  deliveryTime?: string;
returnPolicy?: string;
codAvailable?: boolean;
}

const productSchema = new Schema<IProduct>(
  {

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    category: String,
    
    subCategory: {
     type: String,
     },

    discountType: {
      type: String,
      enum: ["percentage", "flat"]
    },
    
    discountValue: Number,

    finalPrice: Number,

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    /* ⭐ MULTIPLE IMAGES */

    images: [String],

    /* ⭐ UNITS / VARIANTS */

   unitOptions: [
  {
    label: String,
    price: Number,
  },
],

    expiryDate: Date,
    weight: String,
    brand: String,
    warranty: String,
    deliveryTime: String,
returnPolicy: String,
codAvailable: {
  type: Boolean,
  default: true,
},
productDetails: [
  {
    title: String,
    content: String,
  },
],
    modelNumber: String,
    manufacturer: String,
    skinType: String,
    author: String,
    ageGroup: String,
    material: String,

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

/* AUTO CALCULATE FINAL PRICE */

productSchema.pre("save", function (this: IProduct) {

  if (this.discountType && this.discountValue) {

    if (this.discountType === "percentage") {

      this.finalPrice =
        this.price - (this.price * this.discountValue) / 100;

    } else {

      this.finalPrice =
        this.price - this.discountValue;

    }

  } else {

    this.finalPrice = this.price;

  }

});

export default mongoose.model<IProduct>("Product", productSchema);