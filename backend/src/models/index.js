const User = require('./User');
const Student = require('./Student');
const Class = require('./Class');
const Attendance = require('./Attendance');
const FeeTransaction = require('./FeeTransaction');

// Define relationships
User.hasMany(Student, { foreignKey: 'userId', as: 'students' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Student.belongsTo(User, { foreignKey: 'parentId', as: 'parent' });
User.hasMany(Student, { foreignKey: 'parentId', as: 'children' });

Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Class.belongsTo(User, { foreignKey: 'classTeacherId', as: 'teacher' });
User.hasMany(Class, { foreignKey: 'classTeacherId', as: 'classes' });

Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Attendance.belongsTo(User, { foreignKey: 'recordedBy', as: 'recordedByUser' });
User.hasMany(Attendance, { foreignKey: 'recordedBy', as: 'recordedAttendances' });

Student.hasMany(FeeTransaction, { foreignKey: 'studentId', as: 'feeTransactions' });
FeeTransaction.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

module.exports = {
  User,
  Student,
  Class,
  Attendance,
  FeeTransaction,
};
