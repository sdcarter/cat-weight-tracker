FROM node:18-alpine AS build

WORKDIR /app

# Increase Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false

# Copy package files first (leverages Docker layer caching)
COPY package.json ./
# Install dependencies
RUN npm install --silent

# Copy only necessary files for the build
COPY public/ ./public/
COPY src/ ./src/
COPY .eslintrc.json ./
COPY tailwind.config.js ./
COPY .env.production ./

# Run linting during build
RUN npm run lint
# Build the app
RUN npm run build

FROM nginx:alpine
# Copy the build output to replace the default nginx contents
COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]