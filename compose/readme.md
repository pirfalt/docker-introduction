# Hello World HTTP js

## "Test" the app

```sh
# Server
npm run dev
npm run start

# Client
curl http://localhost:3000
curl http://localhost:3000?name=you
```

## Build and run

```sh
# Build the docker image
docker build -t compose-js .

# Run
docker run --name js-compose -p 3000:3000 --init --rm -d compose-js
docker kill js-compose
```
