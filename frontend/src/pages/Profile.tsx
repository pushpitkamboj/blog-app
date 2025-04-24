import React from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { CalendarDays, Mail, User } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-accent-500 h-32"></div>
        
        <div className="px-4 py-5 sm:px-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 border-4 border-white text-gray-400">
              <User className="h-10 w-10" />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </dt>
              <dd className="mt-1 text-gray-900">{user.email}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Username
              </dt>
              <dd className="mt-1 text-gray-900">{user.username}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Member Since
              </dt>
              <dd className="mt-1 text-gray-900">
                {user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Your Posts</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage and edit your blog posts
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/my-posts">
                <Button>
                  View My Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;