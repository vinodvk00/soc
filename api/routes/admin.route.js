import express from "express";
import { updateBeneficiary, uploadExcel } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../utils/verifyUser.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.put("/update-beneficiary/:id", verifyAdmin, updateBeneficiary);
router.post("/upload-excel", verifyAdmin, upload.single("file"), uploadExcel);

export default router;
