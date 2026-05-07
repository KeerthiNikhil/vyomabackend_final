import Address from "../models/address.model.js";

export const saveAddress = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user: req.user.id,
    };

    const existing = await Address.findOne({
      user: req.user.id,
    });

    let address;

    if (existing) {
      address = await Address.findOneAndUpdate(
        { user: req.user.id },
        data,
        { new: true }
      );
    } else {
      address = await Address.create(data);
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to save address",
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user.id,
    });

    res.json({
      success: true,
      data: address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};