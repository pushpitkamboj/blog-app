# Step 1: Set the base image to Node.js with a version of your choice
FROM node:22-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Step 4: Install project dependencies
RUN npm install --production
RUN npm install -g nodemon


# Step 5: Copy the rest of the project files to the container
COPY . .

# Step 6: Build the TypeScript files
RUN npm run build

# Step 7: Expose the port your app will run on
EXPOSE 3000

# Step 8: Start the app
CMD ["npm", "start"]
