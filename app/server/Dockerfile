FROM 18.20.8-alpine

WORKDIR /app

# Copy package files 
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy source code and build
COPY . .
RUN yarn build

# Expose port (should match what's in docker-compose)
EXPOSE 8000

# Start the application (adjust path as needed)
CMD ["node", "dist/index.js"]