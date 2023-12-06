FROM node:latest as build

WORKDIR /usr/src/app

COPY ./srcs/package.json .
COPY ./srcs/package-lock.json .

RUN npm install

COPY ./srcs .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

ENTRYPOINT [ "npm", "run", "start:dev" ]
