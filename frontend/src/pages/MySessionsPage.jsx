import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import SessionCard from '../components/SessionCard';
import SessionEditorModal from './EditSessionsPage';

const MySessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await axiosInstance.get('/api/session/my-sessions');
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleSave = (savedSession) => {
    setSessions(prev => 
      editingSession 
        ? prev.map(s => s._id === savedSession._id ? savedSession : s)
        : [savedSession, ...prev]
    );
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await axiosInstance.delete(`/api/session/delete/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handlePublish = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/session/update/${id}`, { status: 'published' });
      setSessions(prev => prev.map(s => s._id === id ? data : s));
    } catch (error) {
      console.error('Failed to publish session:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Sessions</h1>
        <button 
          onClick={() => {
            setEditingSession(null);
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <PlusCircle className="mr-2" /> New Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
          <SessionCard
            key={session._id}
            session={session}
            isEditable={true}
            onEdit={() => {
              setEditingSession(session);
              setShowModal(true);
            }}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        ))}
      </div>

      {showModal && (
        <SessionEditorModal
          session={editingSession}
          mode={editingSession ? 'edit' : 'create'}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MySessionsPage;