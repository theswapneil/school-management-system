const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get(
  '/',
  (req, res) => classController.getAllClasses(req, res)
);

router.get(
  '/:id',
  (req, res) => classController.getClassById(req, res)
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => classController.createClass(req, res)
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => classController.updateClass(req, res)
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => classController.deleteClass(req, res)
);

module.exports = router;
