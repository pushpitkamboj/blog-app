import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, PenSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
    closeDropdown();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <PenSquare className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BlogApp</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-posts" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Posts
                </Link>
                <Link to="/create-post" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Create Post
                </Link>
                <div className="relative ml-3" ref={dropdownRef}>
                  <button 
                    className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="mr-1">{user?.username}</span>
                    <User className="h-4 w-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-posts"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  My Posts
                </Link>
                <Link
                  to="/create-post"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  Create Post
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  <Button className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;