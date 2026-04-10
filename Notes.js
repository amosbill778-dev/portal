// models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    // linking directly to the Student/User model
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // or 'Student' depending on your model name
        required: true 
    },
    courseId: { 
        type: String, // Keep as String if you don't have a Course model yet
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Note', NoteSchema);
