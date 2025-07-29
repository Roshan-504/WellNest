import React, { useState, useEffect } from 'react';
import {
  X, Save, Upload, Trash2, Youtube, Loader2, CheckCircle, AlertCircle,
  Image
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

const SessionEditorModal = ({
  session = null,
  onClose,
  onSave,
  mode = 'edit'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    imageUrl: '',
    tags: '',
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && session) {
      setFormData({
        title: session.title,
        description: session.description,
        youtube_url: session.youtube_url,
        tags: session.tags.join(', '),
        status: session.status
      });
    }
  }, [session, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.youtube_url.trim()) newErrors.youtube_url = 'YouTube URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish = false) => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: publish ? 'published' : formData.status
      };

      const response = mode === 'create' 
        ? await axiosInstance.post('/api/session/create', dataToSave)
        : await axiosInstance.patch(`/api/session/update/${session._id}`, dataToSave);
      
      onSave(response.data);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to save session' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Session' : 'Edit Session'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.submit}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Session title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your session"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL *
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Youtube className="h-5 w-5 text-red-600" />
              </span>
              <input
                type="text"
                id="youtube_url"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleChange}
                className={`flex-1 block w-full rounded-none rounded-r-md px-3 py-2 border ${errors.youtube_url ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            {errors.youtube_url && (
              <p className="mt-1 text-sm text-red-600">{errors.youtube_url}</p>
            )}
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image URL 
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Image className="h-5 w-5 text-red-600" />
              </span>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`flex-1 block w-full rounded-none rounded-r-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="https://Google.com/image/..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="yoga, meditation, morning (comma separated)"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Draft</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center sticky bottom-0">
          <div className="flex items-center text-sm text-gray-500">
            {session?.updatedAt && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last saved: {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {mode === 'edit' && (
              <button
                onClick={handleDeleteClick}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </button>
            )}
            
            <button
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save {formData.status === 'draft' ? 'Draft' : ''}
            </button>
            
            {formData.status === 'draft' && (
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEditorModal;