const mongoose = require('mongoose');

const feeTransactionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    feeType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending',
    },
    dueDate: Date,
    paidDate: Date,
    remarks: String,
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FeeTransaction', feeTransactionSchema);
