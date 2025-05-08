# TO-DO-TASK Application

This is a full-stack TODO Task Management application built using React (frontend), Node.js/Express (backend), and MySQL (database), containerized with Docker.

## Project Structure

```
TO-DO-TASK/
├── client/          # React frontend
├── server/          # Node.js backend
├── .env             # Environment variables for backend
├── docker-compose.yml
├── README.md
```

## Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/)

## Environment Variables

Create a `.env` file in the root directory for the backend:

```
DB_PASSWORD=password
DB_NAME=todos
```

## Docker Setup

### 1. Dockerfile for Client (`client/Dockerfile`)

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Ensure `client/package.json` contains:

```json
"scripts": {
  "start": "serve -s build",
  "build": "react-scripts build"
}
```

### 2. Dockerfile for Server (`server/Dockerfile`)

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

### 3. docker-compose.yml

```yaml
version: '3.8'

services:
  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
    networks:
      - todo-net

  server:
    build: ./server
    ports:
      - "5000:5000"
    env_file:
      - .env
    volumes:
      - ./server:/app
    depends_on:
      - mysql
    networks:
      - todo-net

  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: todo_db
    ports:
      - "3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - todo-net

volumes:
  mysql-data:

networks:
  todo-net:
    driver: bridge
```

## Run the App

```bash
docker-compose up --build
```

* React Frontend: [http://localhost:3000](http://localhost:3000)
* Node.js Backend: [http://localhost:5000](http://localhost:5000)

## API Endpoints

You can define your API endpoints in `server/routes` and connect them in `server.js`.
