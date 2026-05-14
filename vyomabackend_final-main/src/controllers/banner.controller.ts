import Banner from "../models/banner.model.js";

export const createBanner = async (req, res) => {

  try {

    console.log(req.file);

    const banner = await Banner.create({

      title: req.body.title,

      image: req.file?.location,

      priority: req.body.priority,

      status: req.body.status,

    });

    res.status(201).json({

      success: true,

      data: banner,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      error,

    });

  }

};
export const getBanners = async (req, res) => {

  try {

    const banners = await Banner.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: banners,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }

};
export const updateBanner = async (req, res) => {

  try {

    const updateData: any = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      redirectType: req.body.redirectType,
      redirectValue: req.body.redirectValue,
      isActive: req.body.isActive,
    };

    if (req.file) {
      updateData.image = req.file.location;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: banner,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }

};
export const deleteBanner = async (req, res) => {

  try {

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted",
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }

};