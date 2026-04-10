const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    studentId: String,
    fullName: String,
    email: String,
    password: String,
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
});

// Backend/models/User.js
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Ideally hashed with bcrypt
    role: { 
        type: String, 
        enum: ['student', 'admin', 'staff'], 
        default: 'student' 
    },
    createdAt: { type: Date, default: Date.now }
});

    status: { 
        type: String, 
        enum: ['active', 'locked'], 
        default: 'active' 
    }
});

module.exports = mongoose.model('User', UserSchema);
