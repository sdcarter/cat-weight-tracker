FROM node:22-alpine AS build

WORKDIR /app

# Increase Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Set API URL for production build
ENV REACT_APP_API_URL=/api

# Copy package files first (leverages Docker layer caching)
COPY package.json ./
# Install dependencies
RUN npm install --silent

# Copy all necessary files for the build
COPY . .

# Run linting during build - temporarily disabled due to TypeScript parsing issues
# RUN npm run lint
# Build the app
RUN npm run build

FROM nginx:alpine
# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]