FROM node:alpine AS base
LABEL maintainer=DrinkLessCola
WORKDIR /home/blog-server
COPY package*.json .
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
RUN tsc
EXPOSE 3000
CMD ["node", "src/build/app.js"]