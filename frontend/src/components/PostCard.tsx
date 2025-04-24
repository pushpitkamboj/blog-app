import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Image as ImageIcon } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const defaultImage = 'https://images.pexels.com/photos/3985368/pexels-photo-3985368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/posts/${post.id}`} className="block aspect-w-16 aspect-h-9 overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[180px] object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to default image if S3 image fails to load
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
        ) : (
          <div className="w-full h-[180px] bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <User className="h-4 w-4 mr-1" />
          <span>{post.author?.username || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 mb-4 flex-grow">
          {truncateContent(post.content || '', 120)}
        </p>
        <Link
          to={`/posts/${post.id}`}
          className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center transition-colors mt-auto"
        >
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;