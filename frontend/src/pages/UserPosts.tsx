import React, { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import { FilePlus, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const data = await postsAPI.getUserPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        setError('Failed to load your posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Link to="/create-post" className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <FilePlus className="h-5 w-5 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading your posts...</span>
        </div>
      ) : error ? (
        <div className="bg-error-50 text-error-800 p-4 rounded-md">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-3">You haven't created any posts yet</h2>
          <p className="text-gray-500 mb-6">Start sharing your thoughts with the world!</p>
          <Link to="/create-post">
            <Button size="lg" className="animate-pulse">
              Create Your First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;