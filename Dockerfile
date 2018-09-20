FROM node:10.10.0-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Bundle everything but files in dockerignore
COPY . .

EXPOSE 3000
RUN npm install
CMD [ "npm", "run" ,"start" ]