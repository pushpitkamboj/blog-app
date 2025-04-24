import { 
  createBrowserRouter,
  Navigate,
  RouteObject
} from 'react-router-dom';

import Home from '../pages/Home';
import PostDetail from '../pages/PostDetail';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import UserPosts from '../pages/UserPosts';
import Profile from '../pages/Profile';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Define routes as objects with future flag consideration
export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'posts/:id',
        element: <PostDetail />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'create-post',
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
      },
      {
        path: 'edit-post/:id',
        element: <ProtectedRoute><EditPost /></ProtectedRoute>,
      },
      {
        path: 'my-posts',
        element: <ProtectedRoute><UserPosts /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

// Create router with future flags enabled
export const router = createBrowserRouter(routeConfig, {
  future: {
    v7_relativeSplatPath: true,
  },
});