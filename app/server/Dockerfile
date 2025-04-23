FROM node:22-alpine

WORKDIR /app

# Copy package files 
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "dist/index.js"]