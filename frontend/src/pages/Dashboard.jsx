import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, User as UserIcon, Heart, PlayCircle, 
  PlusCircle, Bookmark, Clock, Edit, Trash2
} from 'lucide-react';
import useAuthStore from '../stores/authStore';

// Dashboard Components
import SessionCard from '../components/SessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MySessionsPage from './MySessionsPage';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [allSessions, setAllSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls with timeout
        setTimeout(() => {
          // Public sessions data
          setAllSessions([
            {
              _id: '1',
              title: 'Morning Yoga Flow',
              description: 'Start your day with calm and clarity. A gentle guided meditation for focus.',
              youtube_url: 'https://www.youtube.com/embed/morning-yoga',
              tags: ['yoga', 'morning', 'beginner'],
              likes: 125,
              status: 'published',
              imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
              creator: {
                name: 'Sarah Johnson',
                _id: 'creator1'
              }
            },
            {
              _id: '2',
              title: 'Deep Relaxation Meditation',
              description: 'Unwind and prepare your body for a restful night with these gentle poses.',
              youtube_url: 'https://www.youtube.com/embed/meditation',
              tags: ['meditation', 'sleep', 'relaxation'],
              likes: 88,
              status: 'published',
              imageUrl: 'https://images.unsplash.com/photo-1548600916-dc8492f8e845',
              creator: {
                name: 'Michael Chen',
                _id: 'creator2'
              }
            },
            {
              _id: '3',
              title: 'Breathwork for Anxiety',
              description: 'Simple breathing exercises to calm your nervous system and reduce anxiety.',
              youtube_url: 'https://www.youtube.com/embed/breathwork',
              tags: ['breathwork', 'stress-relief'],
              likes: 210,
              status: 'published',
              imageUrl: 'https://images.unsplash.com/photo-1603988673322-9477b78972e3',
              creator: {
                name: 'Emma Wilson',
                _id: 'creator3'
              }
            }
          ]);

          // User's sessions data
          setMySessions([
            {
              _id: '4',
              title: 'My Morning Routine',
              description: 'Personal morning yoga and meditation routine',
              youtube_url: 'https://www.youtube.com/embed/my-morning',
              tags: ['yoga', 'meditation', 'routine'],
              likes: 42,
              status: 'published',
              imageUrl: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e',
              user_id: user?._id,
              creator: {
                name: user?.name || 'You',
                _id: user?._id
              }
            },
            {
              _id: '5',
              title: 'Work Break Stretches',
              description: 'Quick stretches to do during work breaks (draft)',
              youtube_url: '',
              tags: ['stretching', 'quick'],
              likes: 0,
              status: 'draft',
              imageUrl: 'https://images.unsplash.com/photo-1532468301980-60b779a572c5',
              user_id: user?._id,
              creator: {
                name: user?.name || 'You',
                _id: user?._id
              }
            }
          ]);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredAllSessions = allSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMySessions = mySessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
            WellNest
          </Link>
          
          <div className="relative w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                <span className="text-indigo-600 font-medium">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Sessions
            </button>
          </nav>
        </div>

        {/* Sessions Display */}
        {activeTab === 'all' ? (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Wellness Sessions</h2>
            {filteredAllSessions.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No sessions found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllSessions.map(session => (
                  <SessionCard 
                    key={session._id} 
                    session={session} 
                    showCreator={true}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <MySessionsPage/>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;