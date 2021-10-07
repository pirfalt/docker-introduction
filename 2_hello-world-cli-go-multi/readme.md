# Hello World CLI go multi stage docker build

```sh
# Build the docker image
# Which also builds the app correctly in the process
docker build -t hello-go-multi .
```

```sh
# Create and run a container, from the image
docker run hello-go-multi
```
