import Category from "../models/category.model.js";

// ================= CREATE =================
export const createCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    // 🔒 Always scope by vendor
    let category = await Category.findOne({
      name,
      vendor: req.user.id,
    });

    // ================= EXISTING CATEGORY =================
    if (category) {
      // ✅ Prevent duplicate subcategories
      const newSubs = subCategories.filter(
        (sub) => !category.subCategories.includes(sub)
      );

      category.subCategories.push(...newSubs);
      await category.save();

      return res.json({
        success: true,
        message: "Subcategories added to existing category",
        data: category,
      });
    }

    // ================= NEW CATEGORY =================
    category = await Category.create({
      name,
      subCategories,
      vendor: req.user.id,
    });

    res.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET MY =================
export const getMyCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      vendor: req.user.id,
    });

    res.json({ success: true, data: categories });

  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};


// ================= UPDATE ================= ✅
export const updateCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, subCategories },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true, data: category });

  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};


// ================= DELETE ================= ✅
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
