# Hello World CLI go

## Build the app on my machine

```sh
# Build the program for linux
export CGO_ENABLED=0
export GOARCH=amd64

## build for linux
export GOOS=linux
go build -o bin/hello-world-simple_$GOARCH-$GOOS main.go

## build for mac
export GOOS=darwin
go build -o bin/hello-world-simple_$GOARCH-$GOOS main.go
```

## "Test" the app

```sh
bin/hello-world-simple_amd64-darwin
bin/hello-world-simple_amd64-linux
```

## Package the app into a docker image

```sh
# Build the docker image
docker build -t hello-go-simple .
```

## Unpack and run the docker image

```sh
# Create and run a container, from the image
docker run hello-go-simple
```
