FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install

RUN npm install node-sass

RUN npm run build

EXPOSE 3000

RUN npm run start