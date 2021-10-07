# Hello World HTTP go

## Build the app on my machine

```sh
# Build the program for linux
export CGO_ENABLED=0
export GOARCH=amd64

## build for linux
export GOOS=linux
go build -o bin/hello-world-http_$GOARCH-$GOOS main.go

## build for mac
export GOOS=darwin
go build -o bin/hello-world-http_$GOARCH-$GOOS main.go
```

## "Test" the app

```sh
# Server
bin/hello-world-http_amd64-darwin
bin/hello-world-http_amd64-linux

# Client
curl http://localhost:3000
curl http://localhost:3000?name=you
```

## Package the app into a docker image

Two different ways of creating a docker image, using two different `Dockerfile`:s.

### Build on my machine and package

```sh
# Build the docker image
docker build -f Dockerfile.simple -t hello-go-http:simple .
```

### Build and package using docker

```sh
# Build the docker image
# Which also builds the app correctly in the process
docker build -f Dockerfile.multistage -t hello-go-http:multistage .
```

## Unpack and run the docker image

```sh
# Create and run a container, from the image
docker run hello-go-http:simple

# "Test"
curl http://localhost:3000?name=you

# Create and run again, this time with port 3000 open
docker run -p 3000:3000 hello-go-http:simple
```

```sh
# Run the other container as well
docker run hello-go-http:multistage
docker run -p 3000:3000 hello-go-http:multistage

# On a different port, without changing the image
docker run -p 3001:3000 hello-go-http:multistage

# Should work now
curl http://localhost:3000?name=you
curl http://localhost:3001?name=you
```
