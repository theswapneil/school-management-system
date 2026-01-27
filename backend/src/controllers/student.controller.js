const studentService = require('../services/student.service');

class StudentController {
  async getAllStudents(req, res) {
    console.log('here getStudents');
    try {
      const filters = {
        status: req.query.status,
        classId: req.query.classId,
      };

      console.log('success', res);
      const students = await studentService.getAllStudents(filters);
      return res.status(200).json({
        message: 'Students retrieved successfully',
        data: students,
      });
    } catch (error) {
        console.log('error', error);
      return res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  }

  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);
      return res.status(200).json({
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (error) {
      return res.status(error.message === 'Student not found' ? 404 : 500).json({
        message: error.message,
      });
    }
  }

  async createStudent(req, res) {
    try {
      const studentData = req.body;
      const student = await studentService.createStudent(studentData);
      return res.status(201).json({
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating student', error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const studentData = req.body;
      const student = await studentService.updateStudent(id, studentData);
      return res.status(200).json({
        message: 'Student updated successfully',
        data: student,
      });
    } catch (error) {
      return res.status(error.message === 'Student not found' ? 404 : 500).json({
        message: error.message,
      });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      await studentService.deleteStudent(id);
      return res.status(200).json({
        message: 'Student deleted successfully',
      });
    } catch (error) {
      return res.status(error.message === 'Student not found' ? 404 : 500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();
