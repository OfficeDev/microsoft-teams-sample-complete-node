FROM node:10-alpine

WORKDIR /home/node

ADD . /home/node

RUN npm install

ENTRYPOINT [ "/usr/local/bin/npm" ]
CMD [ "start" ]
