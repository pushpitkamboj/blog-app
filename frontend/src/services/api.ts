import axios from 'axios';
import { Post, PostInput, User, UserLogin, UserSignup } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'Server is not responding. Please try again later.' });
    } else {
      // Request setup error
      return Promise.reject({ message: 'Failed to make request. Please try again.' });
    }
  }
);

// Auth API
export const authAPI = {
  signup: async (userData: UserSignup) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  login: async (credentials: UserLogin) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Posts API
export const postsAPI = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },
  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  getUserPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts/my-posts');
    return response.data;
  },
  createPost: async (postData: FormData): Promise<Post> => {
    try {
      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (const pair of postData.entries()) {
        if (pair[0] === 'image') {
          console.log(`${pair[0]}: File with name ${(pair[1] as File).name}, type ${(pair[1] as File).type}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      // Override standard content-type header
      // as axios will set the correct multipart boundary
      const response = await api.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  },
  updatePost: async (id: string, postData: PostInput | FormData): Promise<Post> => {
    try {
      // Check if postData is FormData (has image) or regular JSON object
      const isFormData = postData instanceof FormData;
      
      const response = await api.put(`/posts/${id}`, postData, {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      });
      return response.data.post || response.data; // Handle different response formats
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  },
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;