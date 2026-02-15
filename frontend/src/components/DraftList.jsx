import { Plus, FileText } from 'lucide-react';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';

function DraftList() {
  const posts = useEditorStore((state) => state.posts);
  const currentPost = useEditorStore((state) => state.currentPost);
  const setCurrentPost = useEditorStore((state) => state.setCurrentPost);
  const addPost = useEditorStore((state) => state.addPost);
  const setPosts = useEditorStore((state) => state.setPosts);

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
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
            <p className="text-xs mt-1 text-gray-400">Create your first post</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => handleSelectPost(post)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  currentPost?.id === post.id
                    ? 'bg-blue-50 border border-blue-400 shadow-sm'
                    : 'hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">
                      {post.title || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{formatDate(post.updated_at)}</span>
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <FileText
                    size={16}
                    className={
                      currentPost?.id === post.id
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DraftList;
