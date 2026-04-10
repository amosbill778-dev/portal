const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    studentId: String,
    fullName: String,
    email: String,
    reason: String,
    
    courseId: String,
    applicationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
