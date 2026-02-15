import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DraftList from '../components/DraftList';
import Editor from '../components/Editor';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const { setPosts, setCurrentPost, setLoading } = useEditorStore();

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
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <DraftList />
        <Editor />
      </div>
    </div>
  );
}

export default Dashboard;
