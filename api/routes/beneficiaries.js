import express from "express";
import Beneficiary from "../models/beneficiary.model.js";

const router = express.Router();

// GET all beneficiaries
router.get("/all", async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();
    res.status(200).json(beneficiaries);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// GET a single beneficiary
router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    console.log(beneficiary);
    res.status(200).json(beneficiary);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// TODO: create a /add route to add a new beneficiary


export default router;
