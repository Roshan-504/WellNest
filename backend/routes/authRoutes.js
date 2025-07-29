import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { use } from 'react';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

router.get('/verify', authenticate, (req, res) => {
  // The authenticate middleware already verified the token
  res.json({user: {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }});
});

export default router;