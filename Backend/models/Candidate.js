const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot be more than 50 years']
  },
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Resume link must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['applied', 'interview', 'offer', 'rejected'],
    default: 'applied',
    required: true
  },
  appliedDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  }],
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  source: {
    type: String,
    trim: true,
    maxlength: [100, 'Source cannot be more than 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted applied date
candidateSchema.virtual('formattedAppliedDate').get(function() {
  return this.appliedDate.toLocaleDateString();
});

// Virtual for status display name
candidateSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected'
  };
  return statusMap[this.status] || this.status;
});

// Index for better query performance
candidateSchema.index({ status: 1, appliedDate: -1 });
candidateSchema.index({ name: 'text', role: 'text' });
candidateSchema.index({ email: 1 });

// Pre-save middleware to ensure appliedDate is set
candidateSchema.pre('save', function(next) {
  if (!this.appliedDate) {
    this.appliedDate = new Date();
  }
  next();
});

// Static method to get candidates by status
candidateSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ appliedDate: -1 });
};

// Static method to get analytics data
candidateSchema.statics.getAnalytics = async function() {
  const pipeline = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgExperience: { $avg: '$experience' }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        avgExperience: { $round: ['$avgExperience', 1] }
      }
    }
  ];

  return this.aggregate(pipeline);
};

// Instance method to update status
candidateSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
