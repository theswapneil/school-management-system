const User = require('./User');
const Student = require('./Student');
const Class = require('./Class');
const Attendance = require('./Attendance');
const FeeTransaction = require('./FeeTransaction');

// Mongoose handles relationships through populate()
// No explicit relationship definitions needed

module.exports = {
  User,
  Student,
  Class,
  Attendance,
  FeeTransaction,
};
