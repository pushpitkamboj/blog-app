import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">BlogApp</h3>
            <p className="text-gray-600 mb-4">
              A platform for sharing your thoughts, ideas, and stories with the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="text-gray-600 hover:text-primary-600 transition-colors">
                  My Posts
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-error-500 mx-1" /> by BlogApp Team
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} BlogApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;