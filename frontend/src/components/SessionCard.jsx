import { Link } from 'react-router-dom';
import { PlayCircle, Heart, Clock, UserIcon, Edit, Trash2, Eye, Upload } from 'lucide-react';

const SessionCard = ({ 
  session, 
  isEditable = true,
  onPublish = () => {},
  onUnpublish = () => {},
  onDelete = () => {},
  isProcessing = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Status Bar */}
      {isEditable && (
        <div className={`p-3 flex justify-between items-center ${
          session.status === 'published' ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            session.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {session.status === 'published' ? 'Published' : 'Draft'}
          </span>
          
          <div className="text-xs text-gray-500">
            <Clock className="inline-block h-3 w-3 mr-1" />
            {new Date(session.updatedAt || session.created_at).toLocaleDateString()}
          </div>
        </div>
      )}
      
      {/* Session Image */}
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        {session.imageUrl ? (
          <img 
            src={session.imageUrl}
            alt={session.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <PlayCircle className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Session Content */}
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 line-clamp-1">{session.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Heart className="h-4 w-4 mr-1 text-red-400" />
            <span>{session.likes}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{session.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <UserIcon className="h-4 w-4 mr-1" /> 
          {session.authorName || 'Anonymous'}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {session.tags?.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        {isEditable ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/sessions/${session._id}`}
              className="flex items-center justify-center py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
            
            <Link
              to={`/sessions/edit/${session._id}`}
              className="flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            
            {session.status === 'published' ? (
              <button
                onClick={() => onUnpublish(session._id)}
                disabled={isProcessing}
                className="flex items-center justify-center py-2 bg-gray-50 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors w-full col-span-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2 transform rotate-180" />
                    Unpublish
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => onPublish(session._id)}
                disabled={isProcessing}
                className="flex items-center justify-center py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors w-full col-span-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={() => onDelete(session._id)}
              disabled={isProcessing}
              className="flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors w-full col-span-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        ) : (
          <Link
            to={`/sessions/${session._id}`}
            className="w-full flex items-center justify-center py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            View Session
          </Link>
        )}
      </div>
    </div>
  );
};

export default SessionCard;