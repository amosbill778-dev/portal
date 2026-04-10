// Backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller functions
const studentController = require('../controllers/studentController');

// Import your security middlewares
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 1. Register a new student (Public access)
router.post('/register', studentController.registerStudent);

// 2. Get all students (Restricted: Must be logged in AND an Admin)
router.get('/', auth, role(['admin']), studentController.getAllStudents);

// 3. Get a student by ID (Restricted: Must be logged in AND Admin or Staff)
router.get('/:id', auth, role(['admin', 'staff']), studentController.getStudentById);

module.exports = router;
