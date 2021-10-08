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

## Build and package using docker

```sh
# Build the docker image
# Which also builds the app correctly in the process
docker build -t hello-js-http .
```

## Unpack and run the docker image

```sh
# Run the other container as well
docker run --name js-http -p 3000:3000  hello-js-http

# Ops! Let't get unstuck
docker ps
docker kill js-http

docker container list -a
docker container rm js-http
docker container prune

# Run again
docker run --name js-http -p 3000:3000 --init hello-js-http
docker run --name js-http -p 3000:3000 --init --rm hello-js-http
docker run --name js-http -p 3000:3000 --init --rm -d hello-js-http

# Should work now
curl http://localhost:3000
curl http://localhost:3000?name=you

# Status check
docker container ls
docker container rm js-http
docker container stop js-http
```

## Dev in docker

```sh
docker run --rm node:16
docker run --rm -it node:16

# Start dev container
docker run \
  --interactive \
  --tty \
  --name js-http-dev \
  -p 3000:3000 \
  --volume $PWD:/app \
  --workdir /app \
  --entrypoint bash \
  node:16

# Dev command inside the container
npm run dev

# Re attach
docker start --interactive --attach js-http-dev
docker stop js-http-dev

docker rm js-http-dev

# Tests
curl http://localhost:3000
curl http://localhost:3000?name=you
```

## Create a bad image

```sh
# Build the docker image
docker build -f Dockerfile.badly -t hello-js-http:badly .
```

```sh
# Create and run a container, from the image
docker run --rm --init --name js-http-badly -p 3000:3000 hello-js-http:badly

# "Test"
curl http://localhost:3000?name=you

# The bad
docker image list hello-js-http
```

### The bad

Your image is larger than it needs to be since it contains all your dev dependencies.

### The much worse

- Your application is _not_ running in production configuration.
- Your production dependencies _should_ have stricter audits. Size is not the worst part of dev dependencies.
- If you have any platform specific dependencies, they are running your local versions instead of the version matching your production environment.
  - Mac or windows, instead of linux.
  - x86 vs arm.
