FROM node:20.10.0

RUN mkdir -p /usr/src/app/frontend

# change directory in container
WORKDIR /usr/src/app/frontend

# copy dependencies
COPY ./package*.json ./

# install missing npm dependencies
RUN npm install

# copy sources into container
COPY . .

# expose port
EXPOSE 3000

# run container
CMD [ "npm", "start" ]