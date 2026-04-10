const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    studentId: String,
    courseId: String,
    videoUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Video', VideoSchema);
