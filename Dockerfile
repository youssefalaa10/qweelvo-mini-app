# Build stage
FROM node:20-alpine AS build

# Install bun and dependencies
RUN npm install -g bun
WORKDIR /app
COPY package*.json ./
COPY bun.lock* ./
RUN bun install

# Copy source and build
COPY . .
ENV VITE_API_BASE_URL=http://qweelvo-order
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
