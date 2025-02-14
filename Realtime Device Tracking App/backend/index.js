import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import Model from './Model/mongoose.js';

const { Register, User: user } = Model;
const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173', credentials: true } });

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Signup
app.post('/save_data', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await Register.findOne({ email })) {
            return res.status(409).json({ ok: false, message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await Register.create({ name, email, password: hashedPassword });
        return res.status(201).json({ ok: true, message: 'User registered successfully', data: newUser });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(401).json({ ok: false, message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ ok: false, message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email }, 'Zohaib', { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        return res.status(200).json({ ok: true, redirect: '/welcome' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ ok: true, message: 'Logout successful', redirect: '/' });
});

// Create User Profile
app.post('/create', async (req, res) => {
    try {
        const { name, email, image } = req.body;
        const newUser = await user.create({ name, email, image });
        return res.status(201).json({ ok: true, data: newUser, message: 'User created successfully', redirect: '/read' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Read Users
app.get('/read', async (req, res) => {
    try {
        const users = await user.find();
        return res.status(200).json({ ok: true, data: users, message: 'Users fetched successfully' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Delete User
app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await user.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }
        return res.status(200).json({ ok: true, message: 'User deleted successfully', redirect: '/read' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Get User for Editing
app.get('/edit/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }
        const userToUpdate = await user.findById(req.params.id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ ok: true, data: userToUpdate });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

// Update User
app.put('/update/:id', async (req, res) => {
    try {
        const { name, email, image } = req.body;
        const updatedUser = await user.findByIdAndUpdate(req.params.id, { name, email, image }, { new: true });
        return res.status(200).json({ ok: true, message: 'User updated successfully', data: updatedUser, redirect: '/read' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});


// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User connected at ${socket.id}`);
    
    socket.on('Send-location', (data) => {
        const { latitude, longitude } = data;
        io.emit('receive-location', { id: socket.id, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    });
    
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', { id: socket.id });
    });
});

// Start Server
server.listen(PORT,'0.0.0.0',() => console.log(`Server running on PORT ${PORT}`));