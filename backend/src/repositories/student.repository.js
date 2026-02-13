const { Student, User, Class } = require('../models');

class StudentRepository {
  async findAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.classId) query.classId = filters.classId;

    return Student.find(query)
      .populate('userId', 'firstName lastName email phone address role')
      .populate('classId', 'name grade')
      .populate('createdById', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return Student.findById(id)
      .populate('userId', 'firstName lastName email phone address role')
      .populate('classId')
      .populate('createdById', 'firstName lastName email');
  }

  async create(studentData) {
    const student = new Student(studentData);
    return student.save();
  }

  async update(id, studentData) {
    return Student.findByIdAndUpdate(id, studentData, { new: true });
  }

  async delete(id) {
    return Student.findByIdAndDelete(id);
  }

  async findByRegistrationNumber(registrationNumber) {
    return Student.findOne({ registrationNumber })
      .populate('userId')
      .populate('classId');
  }
}

module.exports = new StudentRepository();
