FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Bundle everything but files in dockerignore
COPY . .
COPY ./dist/ /dist/
RUN ls /usr/src/app
RUN ls /usr/src/app/dist

EXPOSE 3000

CMD [ "npm", "run" ,"start" ]