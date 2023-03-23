FROM node:alpine AS base
LABEL maintainer=DrinkLessCola
WORKDIR /home/blog-server
COPY package.json .
ENV NODE_ENV=production
RUN npm install --only=dev\
    && npm install\
    && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 3000
CMD ["node", "build/src/app.js"]