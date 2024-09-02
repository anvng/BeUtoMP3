# Use an official Node.js image with Python 3 included
FROM node:20-buster

# Install Python 3 and required packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code
COPY . .

# Expose the port the app will run on
EXPOSE 3001

# Start the app
CMD ["node", "server.js"]
