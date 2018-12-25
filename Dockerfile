FROM node:11-alpine

RUN mkdir /var/app
WORKDIR /var/app

COPY package.json .
RUN npm install

COPY run.sh .
COPY src src

EXPOSE 8080

ENTRYPOINT [ "run.sh" ]
