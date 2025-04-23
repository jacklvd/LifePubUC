FROM node:18-alpine@sha256:3c8a5c5b8b6e5e8b9e6f5b8e8b7e5c8a5c5b8b6e5e8b9e6f5b8e8b7e5c8a5c5

WORKDIR /app

# Install yarn if not already included in the base image
RUN apk add --no-cache yarn

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/index.js"]