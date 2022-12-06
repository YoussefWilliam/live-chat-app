FROM node:latest

RUN env

WORKDIR /client

COPY package.json tailwind.config.js tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]