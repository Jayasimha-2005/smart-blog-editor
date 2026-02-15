import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Send, Check, AlertCircle } from 'lucide-react';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const currentPost = useEditorStore((state) => state.currentPost);
  const updatePostInList = useEditorStore((state) => state.updatePostInList);
  const isSaving = useEditorStore((state) => state.isSaving);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt);
  const setSaving = useEditorStore((state) => state.setSaving);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const markAsFailed = useEditorStore((state) => state.markAsFailed);
  
  const [isPublishing, setIsPublishing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSave = async () => {
    if (!currentPost) return;

    setSaving(true);
    try {
      const response = await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });
      markAsSaved(response.data);
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Failed to save post:', error);
      markAsFailed();
      alert('Failed to save post. Please try again.');
    }
  };

  const handlePublish = async () => {
    if (!currentPost) return;

    setIsPublishing(true);
    try {
      // First save the current content
      await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });

      // Then publish
      const response = await postsAPI.publishPost(currentPost.id);
      updatePostInList(response.data);
      alert('Post published successfully!');
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Get save status text and icon
  const getSaveStatus = () => {
    if (isSaving) {
      return {
        text: 'Saving...',
        icon: <Save size={14} className="animate-pulse" />,
        color: 'text-blue-600',
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        text: 'Unsaved changes',
        icon: <AlertCircle size={14} />,
        color: 'text-orange-600',
      };
    }
    
    if (lastSavedAt) {
      const savedTime = new Date(lastSavedAt);
      const now = new Date();
      const diffMs = now - savedTime;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      
      let timeText = '';
      if (diffSecs < 10) timeText = 'just now';
      else if (diffSecs < 60) timeText = `${diffSecs}s ago`;
      else if (diffMins < 60) timeText = `${diffMins}m ago`;
      else timeText = savedTime.toLocaleTimeString();
      
      return {
        text: `Saved ${timeText}`,
        icon: <Check size={14} />,
        color: 'text-green-600',
      };
    }
    
    return null;
  };

  const saveStatus = getSaveStatus();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Smart Blog Editor</h1>
        
        {/* Auto-save status indicator */}
        {currentPost && saveStatus && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${saveStatus.color}`}>
            {saveStatus.icon}
            <span>{saveStatus.text}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentPost && (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            {currentPost.status === 'draft' && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
              >
                <Send size={16} />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
