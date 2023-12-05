FROM node:latest

RUN apt update -y && apt upgrade -y
RUN apt-get install -y software-properties-common npm
RUN npm install npm@latest -g && npm install n -g && n latest

RUN mkdir -p /etc/ft_tr/srcs
WORKDIR /etc/ft_tr/srcs

COPY ./srcs .

RUN npm install

ENTRYPOINT [ "npm run start:dev" ]
