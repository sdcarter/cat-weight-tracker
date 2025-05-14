FROM node:18-alpine AS build

WORKDIR /app

# Increase Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files first (leverages Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy only necessary files for the build
COPY public/ ./public/
COPY src/ ./src/
COPY .eslintrc.json ./
COPY tailwind.config.js ./

# Run linting during build
RUN npm run lint
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]