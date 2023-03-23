FROM node:alpine AS base
LABEL maintainer=DrinkLessCola
WORKDIR /home/blog-server
COPY package.json .
ENV NODE_ENV=development
RUN npm install --only=development\
    && npm install\
    && npm install typescript -g
ENV NODE_ENV=production
COPY . .
RUN tsc
EXPOSE 3000
CMD ["node", "build/src/app.js"]