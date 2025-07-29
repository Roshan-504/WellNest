import express from 'express';
import { authenticate } from '../middlewares/auth.js';

import {
    getAllPublishedSessions,
    getMySessions,
    createSession,
    updateSession,
    deleteSession
} from '../controllers/sessionsController.js';

const router = express.Router();

// GET all published sessions
router.get('/get-all-sessions',authenticate, getAllPublishedSessions);

// GET logged-in user's sessions
router.get('/my-sessions',authenticate, getMySessions);

// POST create new session
router.post('/create',authenticate, createSession);

// PATCH update a session
router.patch('/update/:id',authenticate, updateSession);

// DELETE a session
router.delete('/delete/:id',authenticate, deleteSession);

export default router;