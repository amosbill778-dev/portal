// Backend/controllers/studentController.js
const Student = require('../models/Student');
// Note: Removed Assignment and Application imports if they aren't used here 
// to keep the code fast.

// 1. Register a new student
const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const newStudent = new Student({ name, email, password });
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to register student' });
    }
};

// 2. Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password'); // Don't send passwords back!
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

// 3. Get a student by ID
const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id).select('-password');
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch student' });
    }
};

// Standard way to export all functions at once
module.exports = {
    registerStudent,
    getAllStudents,
    getStudentById
};
