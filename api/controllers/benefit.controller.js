import Benefit from "../models/benefit.model.js";
import Beneficiary from "../models/beneficiary.model.js";
import { errorHandler } from "../utils/error.js";

export const addBenefit = async (req, res, next) => {
  try {
    const {
      beneficiaryId,
      benefitName,
      description,
      amount,
      category,
      notes
    } = req.body;

    // Input validation
    if (!beneficiaryId || !benefitName || !description || !amount || !category) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Validate amount is a positive number
    if (isNaN(amount) || Number(amount) <= 0) {
      return next(errorHandler(400, "Amount must be a positive number"));
    }

    // Verify beneficiary exists
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return next(errorHandler(404, "Beneficiary not found"));
    }

    // Create new benefit
    const newBenefit = new Benefit({
      beneficiary: beneficiaryId,
      benefitName,
      description,
      amount: Number(amount), // Ensure amount is stored as a number
      category,
      notes: notes || "", // Provide default empty string if notes is not provided
      status: "Pending",
      approvedBy: req.user?._id // Make approvedBy optional in case user auth is not implemented
    });

    await newBenefit.save();

    res.status(201).json({
      success: true,
      message: "Benefit added successfully",
      benefit: {
        _id: newBenefit._id,
        benefitName: newBenefit.benefitName,
        description: newBenefit.description,
        amount: newBenefit.amount,
        category: newBenefit.category,
        notes: newBenefit.notes,
        status: newBenefit.status,
        createdAt: newBenefit.createdAt
      }
    });
  } catch (error) {
    next(error.name === 'ValidationError' 
      ? errorHandler(400, error.message) 
      : error);
  }
};

export const getBeneficiaryBenefits = async (req, res, next) => {
  try {
    const { beneficiaryId } = req.params;

    // Validate beneficiaryId format
    if (!beneficiaryId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(errorHandler(400, "Invalid beneficiary ID format"));
    }

    // Check if beneficiary exists
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return next(errorHandler(404, "Beneficiary not found"));
    }

    const benefits = await Benefit.find({ beneficiary: beneficiaryId })
      .select('-approvedBy -__v') // Exclude unnecessary fields
      .sort({ createdAt: -1 });

    res.status(200).json(benefits); // Return array directly to match frontend expectations
  } catch (error) {
    next(error);
  }
};

export const updateBenefitStatus = async (req, res, next) => {
  try {
    const { benefitId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Distributed'];
    if (!validStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid status value"));
    }

    const benefit = await Benefit.findById(benefitId);
    if (!benefit) {
      return next(errorHandler(404, "Benefit not found"));
    }

    // Add status change tracking
    benefit.statusHistory = benefit.statusHistory || [];
    benefit.statusHistory.push({
      status: benefit.status,
      changedAt: new Date(),
      changedBy: req.user?._id
    });

    benefit.status = status;
    if (status === "Distributed") {
      benefit.distributionDate = new Date();
    }

    await benefit.save();

    res.status(200).json({
      success: true,
      message: "Benefit status updated successfully",
      benefit: {
        _id: benefit._id,
        benefitName: benefit.benefitName,
        description: benefit.description,
        amount: benefit.amount,
        category: benefit.category,
        notes: benefit.notes,
        status: benefit.status,
        distributionDate: benefit.distributionDate,
        statusHistory: benefit.statusHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

// New endpoint to get benefit statistics
export const getBenefitStats = async (req, res, next) => {
  try {
    const { beneficiaryId } = req.params;

    const stats = await Benefit.aggregate([
      { $match: { beneficiary: beneficiaryId } },
      { 
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    const totalStats = await Benefit.aggregate([
      { $match: { beneficiary: beneficiaryId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalBenefits: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          },
          distributedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Distributed"] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      categoryStats: stats,
      overall: totalStats[0] || {
        totalAmount: 0,
        totalBenefits: 0,
        pendingCount: 0,
        distributedCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};