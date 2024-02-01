FROM node:latest

# expose port
EXPOSE 3000

# change directory in container
WORKDIR /usr/src/app/frontend

# copy dependencies
COPY ./app/package*.json ./

# copy sources into container
COPY ./app ./
# COPY ./app/.env.production ./.env.production

# install missing npm dependencies
RUN npm install -g serve
RUN npm install
RUN npm run build

# run container
CMD [ "serve", "-s", "build" ]
STOPSIGNAL SIGKILL
