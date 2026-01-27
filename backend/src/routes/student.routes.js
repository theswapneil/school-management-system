const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get(
  '/',
//   authMiddleware,
  (req, res) => studentController.getAllStudents(req, res)
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => studentController.createStudent(req, res)
);

router.get(
  '/:id',
  authMiddleware,
  (req, res) => studentController.getStudentById(req, res)
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => studentController.updateStudent(req, res)
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => studentController.deleteStudent(req, res)
);

module.exports = router;
