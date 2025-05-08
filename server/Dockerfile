FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY wait-for.sh .
RUN chmod +x wait-for.sh

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
