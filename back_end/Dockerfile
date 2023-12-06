FROM node:latest as build

WORKDIR /usr/src/app/backend

COPY ./srcs/package.json .
COPY ./srcs/package-lock.json .

RUN npm install

COPY ./srcs .

RUN npm run build

RUN npx prisma generate

EXPOSE 3001 5555

ENTRYPOINT [ "npm", "run", "start:dev" ]

STOPSIGNAL SIGKILL
