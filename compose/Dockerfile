# Modified example source, which is also a good reference.
# https://docs.docker.com/language/nodejs/build-images/
FROM node:16

ENV NODE_ENV=production

WORKDIR /app

COPY [ "package.json", "package-lock.json*", "./" ]

RUN npm install --production --ignore-scripts

COPY . .

CMD [ "node", "server.js" ]