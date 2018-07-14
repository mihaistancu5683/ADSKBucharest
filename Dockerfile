FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

# Copy files to container
COPY ./dist/ /dist/
COPY ./views/ /views/
COPY ./package*.json /

EXPOSE 3000
RUN npm install
CMD [ "npm", "run" ,"start" ]