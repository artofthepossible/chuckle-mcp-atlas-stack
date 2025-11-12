# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy source files
COPY public ./public
COPY src ./src
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build React app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts and server files
COPY --from=builder /app/build ./build
COPY src/server.js ./src/
COPY db ./db

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
