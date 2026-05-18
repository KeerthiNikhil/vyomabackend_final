import Product from "../models/product.model";
import Shop from "../models/shop.model";
import XLSX from "xlsx";

/* ================= CREATE PRODUCT ================= */

export const createProduct = async (req: any, res: any) => {

  try {

    const userId = req.user.id;
    

    const {
  name,
  description,
  price,
  stock,
  category,
  subCategory,
  discountType,
  discountValue,
  shop,
  unitOptions,
  productDetails,
  expiryDate,
  weight,
  size,
  brand,
  warranty,
  modelNumber,
  manufacturer,
  skinType,
  author,
  ageGroup,
  material
} = req.body;

    console.log("REQ BODY =", req.body);
console.log("UNIT OPTIONS RAW =", req.body.unitOptions);
console.log("FINAL UNIT OPTIONS =", JSON.parse(unitOptions));

    /* VERIFY SHOP BELONGS TO VENDOR */

    const shopData = await Shop.findOne({
      _id: shop,
      owner: userId
    });

    if (!shopData) {
      return res.status(403).json({
        success: false,
        message: "Invalid shop selection"
      });
    }

    /* HANDLE MULTIPLE IMAGES */
    console.log("REQ FILES =", req.files);
    const images: string[] = [];

if (req.files && Array.isArray(req.files)) {

  req.files.forEach((file: any) => {

    console.log("PRODUCT IMAGE 👉", file.location);

    images.push(file.location);

  });

}

    /* CREATE PRODUCT */

    const product = await Product.create({

      name,
      description,

      price: Number(price || 0),
      stock: Number(stock),

      category,
      subCategory,

      discountType,
      discountValue: Number(discountValue || 0),

      shop,

      images,

      unitOptions: unitOptions
  ? JSON.parse(unitOptions)
  : [],

productDetails: productDetails
  ? JSON.parse(productDetails)
  : [],

      expiryDate,
      weight,
      size,
      brand,
      warranty,
      modelNumber,
      manufacturer,
      skinType,
      author,
      ageGroup,
      material

    });

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error: any) {

    console.log("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (req: any, res: any) => {

  try {

    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    await Product.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/* ================= GET PRODUCTS BY SHOP ================= */

/* ================= GET PRODUCTS BY SHOP ================= */

export const getProductsByShop = async (req: any, res: any) => {

  try {

    const { shopId } = req.params;

    const products = await Product.find({
      shop: shopId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error: any) {

    console.log("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


/* ================= GET VENDOR PRODUCTS ================= */

export const getVendorProducts = async (req, res) => {
  try {

    res.set("Cache-Control", "no-store");

    // ✅ STEP 1: get all shops of this vendor
    const shops = await Shop.find({
      owner: req.user.id,
    });

    // ✅ STEP 2: get products of those shops
    const products = await Product.find({
      shop: { $in: shops.map(s => s._id) },
    }).populate("shop");

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const bulkUploadProducts = async (req: any, res: any) => {

  try {

    const shopId = req.body.shopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop selection required"
      });
    }

    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet);

    const products = data.map((item: any) => ({
      name: item.productName,
      category: item.category,
      price: Number(item.price),
      discountValue: Number(item.discountValue || 0),
      stock: Number(item.stock),
      description: item.description,
      shop: shopId
    }));

    await Product.insertMany(products);

    res.json({
      success: true,
      message: "Products uploaded successfully"
    });

  } catch (error) {

    console.log("BULK UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });

  }

};

export const getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

/* AUTO FALLBACK FOR OLD PRODUCTS */
if (!product.unitOptions || product.unitOptions.length === 0) {
  product.unitOptions = [
    {
      label: product.weight || "1 Unit",
      price: product.finalPrice || product.price,
    },
  ];
}

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

  

};

export const updateProduct = async (req: any, res: any) => {

  try {

    const { productId } = req.params;

    console.log("UPDATE ID =", productId);
    console.log("REQ BODY =", req.body);

    const product = await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }

    // ✅ UPDATE FIELDS
    product.name =
      req.body.name || product.name;

    product.description =
      req.body.description || product.description;

    product.price =
      Number(req.body.price || product.price);

    product.stock =
      Number(req.body.stock || product.stock);

    // ✅ RECALCULATE FINAL PRICE
    if (
      product.discountType &&
      product.discountValue
    ) {

      if (product.discountType === "percentage") {

        product.finalPrice =
          product.price -
          (product.price * product.discountValue) / 100;

      } else {

        product.finalPrice =
          product.price -
          product.discountValue;

      }

    } else {

      product.finalPrice = product.price;

    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error: any) {

    console.log("UPDATE ERROR =", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const getCategoryAnalytics = async (req, res) => {
  try {

    const shops = await Shop.find({ owner: req.user.id });

    const products = await Product.find({
      shop: { $in: shops.map(s => s._id) },
    });

    // ✅ CATEGORY COUNT
    const categoryMap = {};
    const subCategoryMap = {};
    const revenueMap = {};

    products.forEach((p) => {

      // CATEGORY COUNT
      categoryMap[p.category] =
        (categoryMap[p.category] || 0) + 1;

      // SUBCATEGORY COUNT
      if (p.subCategory) {
        subCategoryMap[p.subCategory] =
          (subCategoryMap[p.subCategory] || 0) + 1;
      }

      // REVENUE (basic)
      revenueMap[p.category] =
        (revenueMap[p.category] || 0) +
        (p.finalPrice || p.price);

    });

    res.json({
      success: true,
      data: {
        categoryStats: categoryMap,
        subCategoryStats: subCategoryMap,
        revenueStats: revenueMap,
      },
    });

  } catch (error) {
  console.log("ANALYTICS ERROR 👉", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};