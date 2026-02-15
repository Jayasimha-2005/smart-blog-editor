import { Plus, FileText } from 'lucide-react';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';

function DraftList() {
  const { posts, currentPost, setCurrentPost, addPost, setPosts } = useEditorStore();

  const handleCreateNew = async () => {
    try {
      const response = await postsAPI.createPost('Untitled', {});
      const newPost = response.data;
      addPost(newPost);
      setCurrentPost(newPost);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleSelectPost = (post) => {
    setCurrentPost(post);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateNew}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Create your first post</p>
          </div>
        ) : (
          <div className="p-2">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => handleSelectPost(post)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                  currentPost?.id === post.id
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate mb-1">
                      {post.title || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(post.updated_at)}</span>
                      <span>•</span>
                      <span
                        className={
                          post.status === 'published'
                            ? 'text-green-600 font-medium'
                            : 'text-gray-500'
                        }
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <FileText
                    size={16}
                    className={
                      currentPost?.id === post.id
                        ? 'text-primary-600'
                        : 'text-gray-400'
                    }
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DraftList;
