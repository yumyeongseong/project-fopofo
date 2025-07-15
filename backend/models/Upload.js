const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileType: {
    type: String,
    enum: ['image', 'video', 'document', 'design'],
    required: true
  },
  fileName: String,
  originalName: String,
  filePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Upload', uploadSchema);
