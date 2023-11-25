FROM node:20.9.0

RUN mkdir -p /usr/src/app/frontend

# change directory in container
WORKDIR /usr/src/app

# copy dependencies
COPY ./tmp_app/package*.json ./

# install missing npm dependencies
RUN npm install

# copy sources into container
COPY . .

# expose port
EXPOSE 3000

# run container
CMD [ "npm", "start" ]