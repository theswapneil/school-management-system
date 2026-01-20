const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    section: String,
    grade: {
      type: String,
      required: true,
    },
    classTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    academicYear: String,
    capacity: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Class', classSchema);
