FROM node:alpine AS base
LABEL maintainer=DrinkLessCola
WORKDIR /home/blog-server
COPY package.json .
ENV NODE_ENV=development
RUN npm ci --registry=https://registry.npm.taobao.org\
    && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 3000
CMD ["node", "src/build/app.js"]