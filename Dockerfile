FROM node:latest
LABEL maintainer=DrinkLessCola
RUN mkdir -p /home/blog-server
ADD blog-server.tar.gz /home/blog-server
WORKDIR /home/blog-server
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD ["node", "src/app.js"]