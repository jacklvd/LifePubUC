FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app/

EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start"]