FROM node:6

RUN apt-get update && apt-get install -y sudo vim git-core libnss-mdns libavahi-compat-libdnssd-dev avahi-daemon avahi-discover

RUN npm config set registry http://registry.npmjs.org/ && npm install -g node-gyp

WORKDIR /home/node
RUN git clone https://github.com/KhaosT/HAP-NodeJS.git

WORKDIR /home/node/HAP-NodeJS
RUN npm rebuild && npm install

RUN chown -R node .
