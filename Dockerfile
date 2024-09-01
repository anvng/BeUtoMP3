# Use the official Node.js image as a base image
FROM node:20

# Install Python 3
RUN apt-get update && apt-get install -y python3 python3-pip

# Create a symlink for Python 3 to be accessible as 'python'
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
