const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./middleware/authmiddleware');

require('dotenv').config();

// Models
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Application = require('./models/Application');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { 
    cors: { origin: '*' } 
});

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect('mongodb://localhost:27017/student_portal')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// WebSocket Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token'));
    try {
        const decoded = jwt.verify(token, secretKey);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});

// WebSocket Connection Logic
io.on('connection', (socket) => {
    console.log(`Connected: ${socket.user.userId}`);
    let failedCommands = 0;

    socket.on('adminCommand', async (cmd) => {
        let response = { success: true, message: "" };
        if (!cmd) return;
        const cleanCmd = cmd.toLowerCase().trim();

        // 1. BROADCAST COMMAND
        if (cleanCmd.startsWith("broadcast ")) {
            const broadcastMsg = cmd.substring(10).trim(); 
            if (broadcastMsg) {
                io.emit('newBroadcast', { message: broadcastMsg, admin: socket.user.userId });
                response.message = `📣 Broadcast sent: "${broadcastMsg}"`;
            } else {
                response.success = false;
                response.message = "❌ Message cannot be empty.";
            }
        }
        
        // 2. LIST STUDENTS COMMAND
        else if (cleanCmd === "list students") {
            try {
                const students = await User.find({ role: 'student' }).select('name email status');
                response.message = "--- Registered Students ---<br>" + 
                    students.map(s => `• ${s.name} (${s.email}) [${s.status || 'active'}]`).join('<br>');
            } catch (err) {
                response.success = false;
                response.message = "Error: " + err.message;
            }
        }

        // 3. LOCK COMMAND
        else if (cleanCmd.startsWith("lock ")) {
            const email = cleanCmd.split(" ")[1];
            try {
                const user = await User.findOneAndUpdate({ email }, { status: 'locked' });
                response.message = user ? `🔒 Locked ${email}` : "❌ User not found";
            } catch (err) {
                response.success = false;
                response.message = "Error locking user";
            }
        }

        // 4. UNKNOWN COMMAND / SECURITY
        else {
            failedCommands++;
            response.success = false;
            response.message = "Unknown command ❌";
            if (failedCommands >= 3) io.emit("securityAlert", { level: "WARNING", message: `Suspicious activity from ${socket.user.userId}` });
        }

        socket.emit("commandResult", response);
    });
});

// --- API ROUTES ---

// User login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.status === 'locked') {
            return res.status(403).json({ error: 'Account is locked. Contact admin.' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Storage and Assignments
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.post('/api/assignments/upload', upload.single('file'), async (req, res) => {
    try {
        const { studentId, courseId, assignmentTitle, description, dueDate } = req.body;
        const newAssignment = new Assignment({
            studentId, courseId, assignmentTitle, description, dueDate,
            file: req.file ? req.file.path : null
        });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit' });
    }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
