FROM node:22-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]