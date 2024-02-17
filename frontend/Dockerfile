FROM node:20.11.1-alpine3.18

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

