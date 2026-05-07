import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// GET VENDORS
export const getVendors = async (req: any, res: any) => {
  try {
    const vendors = await User.find({ role: "vendor" });

    res.json({
      success: true,
      data: vendors,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// APPROVE VENDOR
export const approveVendor = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { isActive: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// BLOCK VENDOR
export const blockVendor = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { isActive: false });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export default mongoose.model("Admin", adminSchema);