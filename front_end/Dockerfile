FROM node:latest

# expose port
EXPOSE 3000

RUN mkdir -p /usr/src/app

# change directory in container
WORKDIR /usr/src/app/frontend

# install missing npm dependencies
#RUN npm install

# copy dependencies
COPY ./app/package*.json ./

# copy sources into container
COPY ./app .

# install missing npm dependencies
RUN npm install

# run container
CMD [ "npm", "start" ]

STOPSIGNAL SIGKILL
