import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Edit, Trash2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await postsAPI.getPostById(id);
        setPost(data);
        setImageError(false);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load the post. It may have been removed or you may not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await postsAPI.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/my-posts');
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isAuthor = user && post && user.id === post.authorId;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-error-50 border border-error-200 text-error-800 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-error-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-error-800">Error Loading Post</h3>
            <p className="mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-1" />
            <span>{post.author?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-1" />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
          {post.createdAt !== post.updatedAt && (
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>Updated {format(new Date(post.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        
        {isAuthor && (
          <div className="flex items-center space-x-3 mb-6">
            <Link to={`/edit-post/${post.id}`}>
              <Button variant="outline" size="sm" className="flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Edit Post
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              className="flex items-center"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
        
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
          {post.imageUrl && !imageError ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-[350px] md:h-[450px] object-cover"
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-[350px] md:h-[450px] bg-gray-100 flex flex-col items-center justify-center">
              {imageError ? (
                <>
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">Failed to load image</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No image available</p>
                </>
              )}
            </div>
          )}
        </div>

        {post.imageUrl && (
          <div className="mt-2 text-sm text-gray-500">
            <a 
              href={post.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-600 hover:underline"
            >
              View original image
            </a>
          </div>
        )}
      </header>
      
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-line text-gray-800">
          {post.content}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostDetail;