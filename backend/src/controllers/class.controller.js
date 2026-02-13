const { Class } = require('../models');

class ClassController {
  async getAllClasses(req, res) {
    try {
      const classes = await Class.find().populate('classTeacherId', 'firstName lastName email');
      return res.status(200).json({
        message: 'Classes retrieved successfully',
        data: classes,
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      return res.status(500).json({ message: 'Error fetching classes', error: error.message });
    }
  }

  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classData = await Class.findById(id).populate('classTeacherId', 'firstName lastName email');
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      return res.status(200).json({
        message: 'Class retrieved successfully',
        data: classData,
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      return res.status(500).json({ message: 'Error fetching class', error: error.message });
    }
  }

  async createClass(req, res) {
    try {
      const { name, section, grade, classTeacherId, academicYear, capacity } = req.body;

      if (!name || !grade) {
        return res.status(400).json({ message: 'Name and grade are required' });
      }

      const classData = await Class.create({
        name,
        section,
        grade,
        classTeacherId,
        academicYear,
        capacity,
      });

      return res.status(201).json({
        message: 'Class created successfully',
        data: classData,
      });
    } catch (error) {
      console.error('Error creating class:', error);
      return res.status(500).json({ message: 'Error creating class', error: error.message });
    }
  }

  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const classData = await Class.findByIdAndUpdate(id, updateData, { new: true });

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      return res.status(200).json({
        message: 'Class updated successfully',
        data: classData,
      });
    } catch (error) {
      console.error('Error updating class:', error);
      return res.status(500).json({ message: 'Error updating class', error: error.message });
    }
  }

  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      const classData = await Class.findByIdAndDelete(id);

      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }

      return res.status(200).json({
        message: 'Class deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      return res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
  }
}

module.exports = new ClassController();
