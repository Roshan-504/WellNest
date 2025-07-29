import User from '../models/User.js';
import { generateToken } from '../utils/jwtToken.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { email,name, password } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);


    // Create new user
    const user = new User({ email,name, password: password_hash });
    await user.save();

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};
