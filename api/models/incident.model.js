import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const fileInfoSchema = new mongoose.Schema({
  fileName: String,
  fileSize: String,
  fileType: String,
  fileHash: {
    sha256: String,
    md5: String,
    sha1: String
  }
});

const scanResultSchema = new mongoose.Schema({
  maliciousCount: Number,
  totalEngines: Number,
  detectionRate: Number,
  detectedEngines: [{
    engine: String,
    verdict: String
  }],
  cleanEngines: Number,
  timeoutEngines: Number,
  unsupportedEngines: Number
});

const incidentSchema = new mongoose.Schema({
  incidentNumber: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Malware', 'Phishing', 'Unauthorized Access', 'Data Breach', 'Other'],
    default: 'Other'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  comments: [commentSchema],
  source: {
    type: String,
    default: 'Manual'
  },
  tags: [String],
  metadata: {
    fileInfo: fileInfoSchema,
    scanResults: scanResultSchema,
    uploadTimestamp: Date,
    uploadedBy: {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String
    },
    additionalData: mongoose.Schema.Types.Mixed
  }
});

// Pre-save middleware to generate incident number
incidentSchema.pre('save', async function(next) {
  if (!this.incidentNumber) {
    try {
      // Find the highest incident number and increment by 1
      const highestIncident = await this.constructor.findOne({}, {}, { sort: { 'incidentNumber': -1 } });
      
      if (highestIncident && highestIncident.incidentNumber) {
        // Extract the numeric part and increment
        const numericPart = parseInt(highestIncident.incidentNumber.replace('INC-', ''));
        this.incidentNumber = `INC-${(numericPart + 1).toString().padStart(6, '0')}`;
      } else {
        // First incident
        this.incidentNumber = 'INC-000001';
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Update the updatedAt timestamp on save
incidentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Set resolvedAt when status changes to Resolved
incidentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;