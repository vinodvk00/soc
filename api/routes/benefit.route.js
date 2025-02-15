// api/routes/benefit.route.js

import express from "express";
import { 
  addBenefit, 
  getBeneficiaryBenefits,
  updateBenefitStatus 
} from "../controllers/benefit.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addBenefit);
router.get("/beneficiary/:beneficiaryId", verifyToken, getBeneficiaryBenefits);
router.patch("/status/:benefitId", verifyToken, updateBenefitStatus);

export default router;