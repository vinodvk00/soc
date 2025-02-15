import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    benefitReceived: { type: String },
    amount: { type: Number },
  },
  { timestamps: true }
);

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);
export default Beneficiary;
