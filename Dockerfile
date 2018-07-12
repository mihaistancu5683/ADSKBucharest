FROM node:8.9.1-alpine

# Set the current working directory to the new mapped folder.
WORKDIR /usr/src/app

COPY package*.json ./

# Bundle app source
RUN ls /usr/src/app
RUN mkdir dist
RUN ls /usr/src/app
COPY ./dist/ ./dist/
RUN ls /usr/src/app/dist
RUN mkdir views 
COPY ./views/ ./views/

RUN npm install
RUN ls /usr/src/app

EXPOSE 3000

CMD [ "npm", "run" ,"start" ]