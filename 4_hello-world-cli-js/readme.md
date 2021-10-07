# Hello World CLI go

## Build the app on my machine

No build for JS hello world.

## "Test" the app

```sh
node index.js
```

## Package the app into a docker image

```sh
# Build the docker image
docker build -t hello-js-cli:simple .

docker build -f Dockerfile.fix -t hello-js-cli:simple .
```

## Unpack and run the docker image

```sh
# Create and run a container, from the image
docker run hello-js-cli:simple
```
