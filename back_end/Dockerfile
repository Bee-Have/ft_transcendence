FROM node:latest as build

WORKDIR /usr/src/app/backend

COPY ./srcs/package.json .
COPY ./srcs/package-lock.json .
COPY ./script.sh .
RUN chmod +x script.sh


COPY ./srcs .
RUN mkdir -p uploads/avatar uploads/badge

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3001 5555

ENTRYPOINT [ "bash", "script.sh" ]

STOPSIGNAL SIGKILL
