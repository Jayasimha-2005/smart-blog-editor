import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DraftList from '../components/DraftList';
import Editor from '../components/Editor';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const setPosts = useEditorStore((state) => state.setPosts);
  const setCurrentPost = useEditorStore((state) => state.setCurrentPost);
  const setLoading = useEditorStore((state) => state.setLoading);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch all posts
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await postsAPI.getAllPosts();
        const fetchedPosts = response.data.posts || [];
        setPosts(fetchedPosts);

        // Select first post if available
        if (fetchedPosts.length > 0) {
          setCurrentPost(fetchedPosts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate, setPosts, setCurrentPost, setLoading]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <DraftList />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <Editor />
      </div>
    </div>
  );
}

export default Dashboard;
