FROM node:6

RUN apt-get update && apt-get install -y sudo vim git-core libnss-mdns libavahi-compat-libdnssd-dev avahi-daemon avahi-discover

RUN npm config set registry http://registry.npmjs.org/ && npm install -g node-gyp

WORKDIR /home/node
COPY js/package.json .
RUN npm install
