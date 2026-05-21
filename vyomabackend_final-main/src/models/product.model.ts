import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {

  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;

  discountType?: "percentage" | "flat";
  discountValue?: number;
  offers?: {
  title: string;
  type: "product" | "category" | "global";
}[];

rewardCoins?: number;
  finalPrice?: number;

  shop: mongoose.Types.ObjectId;

  images: string[];

  /* ⭐ UNITS / VARIANTS */

  unitOptions?: {
  label: string;
  price: number;
}[];
deliveryFee?:number;
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
    deliveryFee: {
  type: Number,
  default: 0,
},
    
    discountValue: Number,
    offers: [
  {
    title: String,
    type: {
      type: String,
      enum: [
        "product",
        "category",
        "global"
      ]
    }
  }
],
rewardCoins: {
  type: Number,
  default: 0
},

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

    // original MRP
    price: Number,

    // discounted price
    finalPrice: Number,
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

deliveryFee: {
  type: Number,
  default: 40
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