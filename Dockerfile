# ==========================================================
# Stage 1 - Build Angular application
# ==========================================================

# Use the official Node.js image to compile the Angular app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies using the lock file
# (faster and deterministic than npm install)
RUN npm ci

# Copy the remaining source code
COPY . .

# Build the Angular application in production mode
RUN npm run build -- --configuration production


# ==========================================================
# Stage 2 - Serve application with Nginx
# ==========================================================

# Lightweight Nginx image
FROM nginx:alpine

# Copy the compiled Angular application
COPY --from=build /app/dist/frontend-app/browser /usr/share/nginx/html

# Copy template Nginx configuration
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]