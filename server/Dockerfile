FROM node:latest

RUN npm install -g nodemon

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","start"]