import Session from "../models/Session.js";

// Get all published sessions (public)
export const getAllPublishedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logged-in user's sessions
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new session
export const createSession = async (req, res) => {
  console.log('Creating session with data:', req.body);
  console.log('User ID from token:', req.user._id);
  const session = new Session({
    ...req.body,
    user_id: req.user._id
  });

  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a session
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


