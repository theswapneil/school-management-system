const studentRepository = require('../repositories/student.repository');

class StudentService {
  async getAllStudents(filters = {}) {
    try {
      return await studentRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  async getStudentById(id) {
    try {
      const student = await studentRepository.findById(id);
      if (!student) throw new Error('Student not found');
      return student;
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  async createStudent(studentData) {
    try {
      return await studentRepository.create(studentData);
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  async updateStudent(id, studentData) {
    try {
      return await studentRepository.update(id, studentData);
    } catch (error) {
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  async deleteStudent(id) {
    try {
      return await studentRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = new StudentService();
