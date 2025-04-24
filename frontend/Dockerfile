FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files to the container
COPY . .

# Build the React app
RUN npm run build

# Install a simple http server for serving static content
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 5173

# For development:
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
