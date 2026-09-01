import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'faunapulse_super_secret_jwt_key_2026';

// In-memory store fallback if MongoDB Atlas is disconnected
const inMemoryUsers: any[] = [
  {
    username: 'demo_user',
    passwordHash: bcrypt.hashSync('password123', 10),
    avatarColor: '#10b981'
  }
];

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const cleanUsername = username?.trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }

    const colors = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const passwordHash = await bcrypt.hash(password, 10);

    // Try MongoDB Atlas
    try {
      const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }

      const newUser = await User.create({
        username: cleanUsername,
        password: passwordHash,
        avatarColor
      });

      const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: `Account created! Welcome @${newUser.username} 🎉`,
        token,
        user: { username: newUser.username, avatarColor: newUser.avatarColor }
      });
    } catch (dbErr) {
      // Fallback in-memory
      const exists = inMemoryUsers.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }

      const memUser = { username: cleanUsername, passwordHash, avatarColor };
      inMemoryUsers.push(memUser);

      const token = jwt.sign({ username: cleanUsername }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: `Account created! Welcome @${cleanUsername} 🎉`,
        token,
        user: { username: cleanUsername, avatarColor }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const cleanUsername = username?.trim();
    if (!cleanUsername || !password) {
      return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    // Try MongoDB Atlas
    try {
      const user = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
      if (!user) {
        return res.status(400).json({ message: 'User not found. Please register an account.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password.' });
      }

      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: `Welcome back, @${user.username}! 👋`,
        token,
        user: { username: user.username, avatarColor: user.avatarColor }
      });
    } catch (dbErr) {
      // Fallback in-memory check
      const memUser = inMemoryUsers.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
      if (!memUser) {
        return res.status(400).json({ message: 'User not found. Please register an account.' });
      }

      const isMatch = await bcrypt.compare(password, memUser.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password.' });
      }

      const token = jwt.sign({ username: memUser.username }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: `Welcome back, @${memUser.username}! 👋`,
        token,
        user: { username: memUser.username, avatarColor: memUser.avatarColor }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Login failed: ' + error.message });
  }
});

export default router;
