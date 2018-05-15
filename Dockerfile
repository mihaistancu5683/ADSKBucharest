FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run" ,"start" ]