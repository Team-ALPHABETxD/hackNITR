const mongoose = require('mongoose');

// Crop Details Schema
const cropDetailsSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  growth: {
    type: String,
    required: true,
    enum: ['germination', 'growth', 'flowering', 'fruiting', 'harvest']
  },
  sowing_date: {
    type: Date,
    required: true
  },
  current_date: {
    type: Date,
    required: true
  },
  estimated_production: {
    type: Number,
    required: true,
    min: 0
  },
  storage_availability: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  disease_detect: {
    type: Boolean,
    default: false
  },
  crop_img: {
    type: String,
    required: true
  }
});

// Validated Schema
const validatedSchema = new mongoose.Schema({
  flag: {
    type: Boolean,
    required: true
  },
  reason: {
    type: String,
    default: 'NONE'
  }
});

// Weather Details Schema
const weatherDetailsSchema = new mongoose.Schema({
  temp: {
    type: Number,
    required: true
  },
  hum: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  wind_speed: {
    type: Number,
    required: true,
    min: 0
  },
  summary: {
    type: String,
    required: true
  }
});

// Disease Details Schema
const diseaseDetailsSchema = new mongoose.Schema({
  NA: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: 'None'
  },
  reason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['none', 'present', 'may occur in future', 'occurred in past'],
    default: 'none'
  },
  spoilage_risk: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  days_to_spoil: {
    type: Number,
    min: 0,
    default: 0
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  }
});

// Plan Schema
const planSchema = new mongoose.Schema({
  decision: {
    type: String,
    required: true,
    enum: ['Store', 'Sell', 'Process', 'Discard']
  },
  reason: {
    type: String,
    required: true
  }
});

// Main Crop Analysis Schema
const cropAnalysisSchema = new mongoose.Schema({
  crop_details: {
    type: cropDetailsSchema,
    required: true
  },
  validated: {
    type: validatedSchema,
    required: true
  },
  weather_details: {
    type: weatherDetailsSchema,
    required: true
  },
  disease_details: {
    type: diseaseDetailsSchema,
    required: true
  },
  plan: {
    type: planSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
cropAnalysisSchema.index({ 'crop_details.crop': 1 });
cropAnalysisSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
cropAnalysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CropAnalysis', cropAnalysisSchema);
