FROM node:alpine AS base
LABEL maintainer=DrinkLessCola
WORKDIR /home/blog-server
COPY package.json .
ENV NODE_ENV=development
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
ENV NODE_ENV=production
RUN tsc --version
RUN tsc
EXPOSE 3000
CMD ["node", "src/build/app.js"]