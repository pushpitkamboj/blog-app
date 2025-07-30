import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postsAPI } from '../services/api';
import { Post, PostInput } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { toast } from 'react-toastify';
import { Loader2, AlertTriangle, ExternalLink, Upload, Image, AlertCircle } from 'lucide-react';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostInput & { image?: FileList }>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await postsAPI.getPostById(id);
        setPost(data);
        
        reset({
          title: data.title,
          content: data.content
        });
        
        setImageError(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load the post. It may have been removed or you may not have permission to edit it.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, reset]);

  const validateImageFile = (file: File | undefined): boolean => {
    if (!file) return true;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      return false;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum size is 5MB.');
      return false;
    }
    
    setUploadError(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      if (validateImageFile(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {

        e.target.value = '';
        setSelectedImage(null);
      }
    } else {
      setSelectedImage(null);
    }
  };

  const onSubmit = async (data: PostInput & { image?: FileList }) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      const imageFile = fileInputRef.current?.files?.[0];
      
      if (imageFile && !validateImageFile(imageFile)) {
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for submission
      if (imageFile) {
        // If there's a new image, use FormData
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('image', imageFile);
        
        await postsAPI.updatePost(id, formData);
      } else {
        // If there's no new image, use JSON
        await postsAPI.updatePost(id, {
          title: data.title,
          content: data.content
        });
      }
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin mr-2" />
        <span className="text-gray-600">Loading post...</span>
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
              onClick={() => navigate('/my-posts')}
            >
              Return to My Posts
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        <div>
          <Input
            id="title"
            label="Title"
            placeholder="Enter post title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' }
            })}
            error={errors.title?.message}
          />
        </div>
        
        <div>
          <TextArea
            id="content"
            label="Content"
            placeholder="Write your post content here..."
            rows={12}
            {...register('content', { 
              required: 'Content is required',
              minLength: { value: 5, message: 'Content must be at least 5 characters' }
            })}
            error={errors.content?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image {post.imageUrl ? '(Replace)' : '(Optional)'}
          </label>
          {uploadError && (
            <div className="mb-3 text-error-600 bg-error-50 p-2 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {uploadError}
            </div>
          )}
          
          {/* Show existing image if available and no new image is selected */}
          {post.imageUrl && !selectedImage && !imageError && (
            <div className="mb-4">
              <p className="block text-sm font-medium text-gray-700 mb-1">Current Image</p>
              <img
                src={post.imageUrl}
                alt="Post cover"
                className="max-h-64 rounded-lg border border-gray-200 object-contain"
                onError={handleImageError}
              />
              <div className="mt-2 flex items-center space-x-2">
                {!imageError && (
                  <a 
                    href={post.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-500 inline-flex items-center"
                  >
                    View original
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Image upload area */}
          <div className="mt-1 flex flex-col items-center justify-center p-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef} 
            />
            
            {selectedImage ? (
              <div className="w-full">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="mx-auto max-h-64 object-contain mb-4"
                />
                <div className="flex justify-center">
                  <label
                    htmlFor="image"
                    className="text-sm text-primary-600 hover:text-primary-500 cursor-pointer flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Change image
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center p-4"
              >
                <Image className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-gray-700 font-medium">
                  {post.imageUrl ? 'Replace cover image' : 'Add a cover image'}
                </span>
                <span className="text-gray-500 text-xs mt-1">(JPEG, PNG, GIF, WebP; max 5MB)</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/posts/${id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Update Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;