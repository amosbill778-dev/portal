const mongoose = require('mongoose');
const { create } = require('node:domain');

const ImageSchema = new mongoose.Schema({
    studentId: String,
    courseId: String,
    imageUrl: String,
    uploadedAt: { type: Date, default: Date.now }
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' 
        createdAt: { type: Date, default: Date.now }
    }
});
module.exports = mongoose.model('Image', ImageSchema);

