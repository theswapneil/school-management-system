const studentService = require('../services/student.service');
const authService = require('../services/auth.service');
const User = require('../models/User');

class StudentController {
  async checkEmailExists(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      return res.status(200).json({
        message: 'Email check completed',
        data: { exists: !!existingUser }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error checking email', error: error.message });
    }
  }

  async getAllStudents(req, res) {
    console.log('here getStudents');
    try {
      const filters = {
        status: req.query.status,
        classId: req.query.classId,
      };

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
      const { email, password, firstName, lastName, registrationNumber, classId, status, phone, address, dateOfBirth, createdById } = req.body;

      if (!createdById) {
        return res.status(401).json({ message: 'CreatedById is required' });
      }

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !registrationNumber || !classId) {
        return res.status(400).json({ message: 'Email, password, firstName, lastName, registrationNumber, and classId are required' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password);

      // Create user first
      const newUser = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: 'student',
        isActive: true,
      });

      // Create student record with the new user's ID
      const studentData = {
        userId: newUser._id,
        registrationNumber,
        classId,
        status: status || 'active',
        phone: phone || '',
        address: address || '',
        dateOfBirth,
        createdById,
      };

      const student = await studentService.createStudent(studentData);

      return res.status(201).json({
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      console.error('Error creating student:', error);
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
