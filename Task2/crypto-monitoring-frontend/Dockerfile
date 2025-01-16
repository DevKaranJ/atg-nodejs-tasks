# Use the official Node.js image as a base
FROM node:16 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight server to serve the built files
FROM nginx:alpine

# Copy the build files to the Nginx server
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the necessary port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
