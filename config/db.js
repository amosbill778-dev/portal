// Backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Simplified connection for modern Mongoose
        await mongoose.connect(process.env.mongo_URL); 
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }   
};

module.exports = connectDB;
