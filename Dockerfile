FROM node:latest AS base
LABEL maintainer=DrinkLessCola
RUN mkdir -p /home/blog-server
WORKDIR /home/blog-server
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .

FROM base AS production
RUN npm run build
EXPOSE 3000
CMD ["node", "src/build/app.js"]