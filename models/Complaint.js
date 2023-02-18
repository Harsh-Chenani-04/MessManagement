const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    complaint: String,
    Batch:Number,
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'open' },
    resolved: { type: Boolean, default: false }
  });
  
  // Define a Mongoose model for complaints
  const Complaint = mongoose.model('Complaint', complaintSchema);
  module.exports = Complaint