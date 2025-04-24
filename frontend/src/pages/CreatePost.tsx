import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postsAPI } from '../services/api';
import { PostInput } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { toast } from 'react-toastify';
import { Image, Upload, AlertCircle } from 'lucide-react';

const CreatePost: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PostInput & { image?: FileList }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateImageFile = (file: File | undefined): boolean => {
    if (!file) return true; // No file is valid (since image is optional)
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
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
        // Reset file input if validation fails
        e.target.value = '';
        setSelectedImage(null);
      }
    } else {
      setSelectedImage(null);
    }
  };

  const onSubmit = async (data: PostInput & { image?: FileList }) => {
    try {
      // Get file directly from the ref instead of from the form data
      const imageFile = fileInputRef.current?.files?.[0];
      
      // Validate image if present
      if (imageFile && !validateImageFile(imageFile)) {
        return;
      }
      
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const newPost = await postsAPI.createPost(formData);
      
      toast.success('Post created successfully!');
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Post</h1>
      
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
            Cover Image (Optional)
          </label>
          {uploadError && (
            <div className="mb-3 text-error-600 bg-error-50 p-2 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {uploadError}
            </div>
          )}
          <div className="mt-1 flex flex-col items-center justify-center p-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef} // Connect the ref to the input element
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
                <span className="text-gray-700 font-medium">Add a cover image</span>
                <span className="text-gray-500 text-xs mt-1">(JPEG, PNG, GIF, WebP; max 5MB)</span>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;