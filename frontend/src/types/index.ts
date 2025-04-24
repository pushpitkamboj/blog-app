export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  content: string;
}

export interface UserSignup {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}