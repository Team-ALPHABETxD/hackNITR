const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  services: {
    // e.g., ['professional_help', 'resource_support', 'yield_buying']
    type: [String],
    default: []
  },
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  address: {
    addressLine: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  location: String,
  lat: Number,
  lon: Number,
  serviceRadiusKm: {
    type: Number,
    default: 50
  },
  availability: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
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

// 2dsphere index for geo queries
ngoSchema.index({ location: '2dsphere' });

ngoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NGO', ngoSchema);
