FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Bundle everything but files in dockerignore
COPY . .

EXPOSE 3000
CMD [ "npm", "install" ]
#CMD [ "npm", "run" ,"start" ]