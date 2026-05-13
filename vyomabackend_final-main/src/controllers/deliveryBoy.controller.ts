import DeliveryBoy from "../models/deliveryBoy.model";
import { Request, Response } from "express";

/* CREATE DELIVERY BOY */

export const createDeliveryBoy = async (req: Request, res: Response) => {
  try {

    const { name, phone, email } = req.body;
   
    const file = req.file as Express.MulterS3.File;
    
    const boy = await DeliveryBoy.create({
      name,
      phone,
      email,
      image: file.location,
    });

    res.status(201).json({
      success: true,
      data: boy,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to create delivery boy",
    });

  }
};


/* GET DELIVERY BOYS */

export const getDeliveryBoys = async (_req: Request, res: Response) => {

  try {

    const boys = await DeliveryBoy.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: boys,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery boys",
    });

  }

};


/* DELETE DELIVERY BOY */

export const deleteDeliveryBoy = async (req: Request, res: Response) => {

  try {

    await DeliveryBoy.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Delivery boy deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });

  }

};
export const updateLocation = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;
    const { lat, lng } = req.body;

    const boy = await DeliveryBoy.findByIdAndUpdate(
      id,
      { location: { lat, lng } },
      { new: true }
    );

    res.json({
      success: true,
      data: boy
    });

  } catch {

    res.status(500).json({
      success:false,
      message:"Location update failed"
    });

  }

};

export const markAttendance = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    const boy = await DeliveryBoy.findById(id);

    if(!boy){
      return res.status(404).json({message:"Delivery boy not found"});
    }

    boy.attendanceDays += 1;

    await boy.save();

    res.json({
      success:true,
      attendance: boy.attendanceDays
    });

  } catch {

    res.status(500).json({
      success:false,
      message:"Attendance failed"
    });

  }

};

export const getSalary = async (req: Request, res: Response) => {

  const boy = await DeliveryBoy.findById(req.params.id);

  if(!boy){
    return res.status(404).json({message:"Not found"});
  }

  const deliveryIncome =
    boy.completedOrders * boy.perDeliveryAmount;

  const attendanceBonus =
    boy.attendanceDays >= 25 ? 1000 : 0;

  const totalSalary =
    boy.baseSalary + deliveryIncome + attendanceBonus;

  res.json({

    baseSalary: boy.baseSalary,

    deliveryIncome,

    attendanceBonus,

    totalSalary

  });

};