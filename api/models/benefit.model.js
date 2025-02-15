import mongoose from "mongoose";

const benefitSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true
  },
  benefitName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Financial', 'Healthcare', 'Education', 'Housing', 'Other']
  },
  notes: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Distributed'],
    default: 'Pending'
  },
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: mongoose.Schema.Types.ObjectId
  }],
  distributionDate: Date,
  approvedBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

// Index for efficient querying by beneficiary
benefitSchema.index({ beneficiary: 1, status: 1 });

const Benefit = mongoose.model("Benefit", benefitSchema);
export default Benefit;