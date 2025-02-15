import Beneficiary from "../models/beneficiary.model.js";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Update Beneficiary API
export const updateBeneficiary = async (req, res) => {
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBeneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    res.status(200).json(updatedBeneficiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload & Process Excel File
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
    
    // Add error handling for file reading
    let workbook;
    try {
      workbook = XLSX.readFile(filePath);
    } catch (readError) {
      return res.status(400).json({ 
        message: "Error reading Excel file", 
        error: readError.message 
      });
    }

    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate data before insertion
    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No data found in the Excel file" });
    }

    try {
      await Beneficiary.insertMany(data);
    } catch (insertError) {
      return res.status(500).json({ 
        message: "Error inserting data", 
        error: insertError.message 
      });
    }

    // Safely remove file
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.error("Could not delete file:", unlinkError);
    }

    res.status(200).json({ 
      message: "Excel file processed successfully", 
      recordsProcessed: data.length 
    });
  } catch (error) {
    console.error("Unhandled upload error:", error);
    res.status(500).json({ 
      message: "Internal server error during file upload", 
      error: error.message 
    });
  }
};
