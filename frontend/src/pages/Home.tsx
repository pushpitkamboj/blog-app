import React, { useEffect, useState } from 'react';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await postsAPI.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-8 md:p-16 rounded-2xl text-white mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to BlogApp
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl">
          Discover stories, ideas, and expertise from writers on any topic.
          Share your knowledge and perspectives with the world.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading posts...</span>
        </div>
      ) : error ? (
        <div className="bg-error-50 text-error-800 p-4 rounded-md">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
          <p className="text-gray-500">Be the first to create a post!</p>
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

export default Home;