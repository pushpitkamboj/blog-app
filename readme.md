# BlogApp

A full-stack blog application with a Node.js/TypeScript API backend and React/TypeScript frontend. This application allows users to create an account, publish blog posts with images, and interact with other users' content.

## Project Features

- User authentication (signup, login, profile)
- Create, read, update, and delete blog posts
- Image upload functionality using AWS S3
- Protected routes for authenticated users only
- unprotected routes where user can see blogs

## Project Structure

```plaintext
blog-assignment/
├── api/               # Backend API
│   ├── prisma/        # Database schema and migrations
│   ├── src/           # Backend source code
│   │   ├── middleware/  # Authentication middleware
│   │   ├── routes/      # API routes
│   │   ├── storage/     # S3 storage configuration
│   │   └── swagger/     # API documentation
│   └── Dockerfile     # Docker configuration for API
├── frontend/          # Frontend React application
│   ├── src/           # Frontend source code
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Application pages
│   │   ├── services/    # API service integrations
│   │   └── types/       # TypeScript type definitions
│   └── vite.config.ts # Vite configuration
└── docker-compose.yaml # Docker Compose configuration
```

## Prerequisites

### For Manual Setup

- [Node.js](https://nodejs.org/) (v18 or later)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) database
- [AWS Account](https://aws.amazon.com/) (for S3 image storage)
- [Git](https://git-scm.com/)

### For Docker Setup

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Setup Instructions

You can set up this project either manually or using Docker.

### Option 1: Manual Setup

#### Backend Setup

1. Navigate to the API directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your PostgreSQL database URL, secure secret key, and AWS credentials:

   ```plaintext
   DATABASE_URL="postgresql://username:password@localhost:5432/blog-assignment?schema=public"
   SECRET_KEY="your_secure_secret_key"
   AWS_ACCESS_KEY_ID="your_aws_access_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
   AWS_REGION="your_aws_region"
   AWS_S3_BUCKET="your_s3_bucket_name"
   PORT=3002
   ```

5. Apply the database migrations:

   ```bash
   npx prisma migrate dev --name the migration comment
   ```

6. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

   The API server will be running at <http://localhost:3002>

8. Access Swagger API documentation at:

   ```plaintext
   http://localhost:3002/docs
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend development server will typically run at <http://localhost:5173>

### Option 2: Docker Setup

This project includes Docker configuration for easy setup and deployment.

#### Docker Backend Setup

1. Make sure Docker and Docker Compose are installed on your machine.

2. Create a `.env` file in the backend directory with necessary environment variables.

3. From the root directory of the project, run:

   ```bash
   docker-compose up -d
   ```

   This will start the API server in detached mode.

4. To view logs from the containers:

   ```bash
   docker-compose logs -f
   ```

5. Access the API at <http://localhost:3002> and Swagger documentation at <http://localhost:3002/docs>

6. To stop the containers:

   ```bash
   docker-compose down
   ```

#### Rebuilding Docker Containers

If you make changes to the Dockerfile or need to rebuild the containers:

```bash
docker-compose up -d --build
```

## API Documentation & Swagger Usage Guide

The API comes with comprehensive Swagger documentation that allows you to explore and test all available endpoints.

### Accessing the Swagger UI

1. Start the API server as described in the setup instructions.
2. Open your browser and navigate to <http://localhost:3002/docs>

### Using the Swagger UI

1. **Exploring Endpoints**: All available endpoints are grouped by tags (auth, posts).
2. **Authentication**:
   - First, create an account using the `/auth/signup` endpoint
   - Then, obtain a JWT token by logging in with the `/auth/login` endpoint
   - Copy the token from the response
   - Click the "Authorize" button at the top of the page
   - Enter the token in the format: `Bearer your-token-here`
   - Now you can access protected endpoints

3. **Testing Endpoints**:
   - Click on an endpoint to expand it
   - Click "Try it out"
   - Fill in the required parameters
   - Click "Execute"
   - View the response below

### Important Endpoints

#### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/profile` - Get current user profile (requires authentication)

#### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `GET /posts/my-posts` - Get current user's posts (requires authentication)
- `POST /posts` - Create a new post (requires authentication)
- `PUT /posts/:id` - Update a post (requires authentication)
- `DELETE /posts/:id` - Delete a post (requires authentication)

## Technology Stack

### Backend Technologies

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Programming language
- **Prisma** - Next-generation ORM for Node.js
- **PostgreSQL** - Relational database
- **JSON Web Token (JWT)** - Authentication mechanism
- **bcrypt** - Password hashing
- **AWS SDK** - S3 integration for image uploads
- **Multer** - File upload middleware
- **Zod** - Schema validation library
- **Swagger** - API documentation

### Frontend Technologies

- **React** - UI library
- **TypeScript** - Programming language
- **ViteJS** - Build tool and development server
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **AxiosJS** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **Lucide-React** - Icon library
- **React-Toastify** - Toast notifications
- **Date-fns** - Date utility library

## License

ISC
