const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    studentId: String,
    courseId: String,
    assignmentTitle: String,
    description: String,
    dueDate: Date,
    submitted: Boolean
    title: String,
    description: String,
    dueDate: Date
    filename: String,
    fileUrl: String
    submittedAt: Date, default: Date.now    
Module.exports = mongoose.model('Assignment', assignmentSchema);
});
