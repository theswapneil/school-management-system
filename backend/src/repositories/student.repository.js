const { Student, User, Class } = require('../models');

class StudentRepository {
  async findAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.classId) where.classId = filters.classId;

    return Student.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'parent', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'name', 'grade'] },
      ],
      order: [['id', 'DESC']],
    });
  }

  async findById(id) {
    return Student.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: User, as: 'parent', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Class, as: 'class' },
      ],
    });
  }

  async create(studentData) {
    return Student.create(studentData);
  }

  async update(id, studentData) {
    const student = await Student.findByPk(id);
    if (!student) throw new Error('Student not found');
    return student.update(studentData);
  }

  async delete(id) {
    const student = await Student.findByPk(id);
    if (!student) throw new Error('Student not found');
    return student.destroy();
  }

  async findByRegistrationNumber(registrationNumber) {
    return Student.findOne({
      where: { registrationNumber },
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
      ],
    });
  }
}

module.exports = new StudentRepository();
