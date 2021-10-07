# Just kidding, not hello-world-http

Simplifying the project requirements have been the goal all along.

Let's just use docker, instead of installing the full java toolchain.

## Build image

```sh
# I want to use the dockefile in this dir, but use the example project as the "build context"
docker build -t petclinic-java -f ./Dockerfile ./spring-petclinic
```

## Create and run container

```sh
# Run
docker run --rm --name hello-java-http -p 8080:8080 petclinic-java

# "Test"
curl http://localhost:8080/actuator/health
curl http://localhost:8080/
open http://localhost:8080/
```
