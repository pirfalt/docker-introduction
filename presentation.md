# Introduction to Docker

## Demo time

## Dockerhub

Pre-build images!

### Hello World

```sh
docker run hello-world
```

### Ubuntu / Debian

https://hub.docker.com/_/ubuntu
https://hub.docker.com/_/debian

```sh
docker run -it ubuntu bash
docker run -it debian bash
cat /etc/issue
exit

docker run -it ubuntu:20.04 bash
docker run -it debian:11 bash

docker run -it ubuntu:18.04 bash
docker run -it debian:10 bash
```

### Postgres

https://hub.docker.com/_/postgres

```sh
# Server
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres:14
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres:11
docker container rm -f some-postgres

# Client
docker exec -it some-postgres psql "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

```sql
-- Example queries for the client
\d
\dp
select * from test;
create table test(id uuid primary key, name text);
insert into test(id, name) values
  (gen_random_uuid(), 'you'),
  (gen_random_uuid(), 'me'),
  (gen_random_uuid(), 'emil')
;
```

### MySQL

https://hub.docker.com/_/mysql

```sh
# Server
docker run --name some-mysql -e MYSQL_DATABASE=mydb -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:8.0
docker run --name some-mysql -e MYSQL_DATABASE=mydb -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.7
docker container rm -f some-mysql

# Client
docker exec -it some-mysql mysql --host=localhost --user=root --password=my-secret-pw mydb
```

```sql
-- Example queries for the client
select * from test;
create table test(id int auto_increment primary key, name text);
insert into test(name) values
  ('you'),
  ('me'),
  ('emil')
;
drop table test;
```

### MongoDB

https://hub.docker.com/_/mongo

```sh
# Private Network
docker network create mongo-net

# Server
docker run --name some-mongo -d --network mongo-net mongo:5
docker rm -f some-mongo

# Client
docker run -it --rm --network mongo-net mongo:5 mongo --host some-mongo:27017 test
```

<!-- prettier-ignore -->
```js
db.getName();
db.getCollectionNames();
db.createCollection('testCollection')
db.testCollection.find()
db.testCollection.insertMany([
  { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
  { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
  { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
  { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
  { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
]);
db.testCollection.find()
```

### Redis

https://hub.docker.com/_/redis

```sh
# Server
docker run --name some-redis -d -p 6379:6379 redis:6
docker rm -f some-redis

# Client
docker run -it --rm redis:6 redis-cli -h $(myip)
```

```
ping
get mykey
set mykey somevalue
get mykey
exit
```

What is that `$(myip)` thing?

```sh
ifconfig en0 inet
type myip
```

### Nginx (file-server / proxy / load-balancer)

https://hub.docker.com/_/nginx

```sh
docker run --name some-nginx -d -p 8080:80 \
  -v $(pwd)/static:/usr/share/nginx/html:ro \
  nginx:1.21

curl -i http://localhost:8080
open http://localhost:8080

docker container stop some-nginx
docker container rm some-nginx
```

### Caddy (file-server / proxy / load-balancer)

https://hub.docker.com/_/caddy

```sh
docker run -d -p 8080:80 \
  --name some-caddy \
  -v $PWD/static:/usr/share/caddy:ro \
  caddy:2

curl -i http://localhost:8080
open http://localhost:8080

docker rm -f some-caddy
```

### NodeJS

### Go

### Java

## Application, without `docker-compose`

Let's run a NodeJS application, which had Postgres and Redis as service dependencies.

### Dependencies

```sh
docker run --name app-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:14
docker rm -f app-postgres

docker run --name app-redis -d -p 6379:6379 redis:6
docker rm -f app-redis
```

### App - dev

```sh
npm run dev
```

### App - prod

```sh
docker build -t compose-js .
docker run --name app-node \
  --init \
  --rm \
  -p 3000:3000 \
  -e PG_CONN="postgresql://postgres:mysecretpassword@$(myip):5432/postgres" \
  -e REDIS_CONN="redis://$(myip):6379" \
  compose-js
```

### Tests

```sh
curl -i http://localhost:3000/
curl -i http://localhost:3000/bf6faa84-dc1a-4824-be29-f8a541a77e72
curl -i -X POST -H 'content-type: application/json' --data '{"name": "me"}' http://localhost:3000/
curl -i -X POST -H 'content-type: application/json' --data '{"key": "value"}' http://localhost:3000/
```

### Inspect

```sh
docker ps
```

## `docker-compose`

```sh
docker-compose up
docker-compose up -d
docker-compose down
docker-compose up --build
```

## Background

### How do you run an application in development?

Do your magic 🪄🦄🧞🧚 until it "works on my machine"!

Write down the instructions how to get it running in the readme?

### How do you run something in production?

1. Buy hardware & put in data center.
   Alt. Rent computer "in the 🌥".
2. Install OS.
   Alt. Chose preinstalled OS in the 🌥 computer 👍.
3. Install your applications dependencies.
   Know "everything", `mvn`/`gradle`, `npm`/`yarn`, `pip`, `gem`+`bundler`, `composer`, `cargo`.
   Not just how to use them, but how to install them in a production environment.
   And let's face it, linux. All the little linux tools your application should not need, but somehow does.
4. Install your application.
5. Start your application.
6. Monitor and restart your application if it crashes.

When OS, dependencies or application needs update, redo all steps effected steps and 😭.

## Note about cost

In short, we should pay to use "docker desktop". Either directly or via clients.\
https://docs.docker.com/subscription/

> The effective date of these terms is August 31, 2021. There is a grace period until January 31, 2022

However, all of the things powering "docker desktop" is open source and free to use. So we could get around payment.

- This article show you one way to do that on a mac.\
  https://itnext.io/goodbye-docker-desktop-hello-minikube-3649f2a1c469
- `podman` is a potential drop in replacement.\
  https://podman.io/

The only thing you sacrifice is the ease of use, and maybe stability, wish is why we use docker in the first place.

(However, personally im going to try both, before attempting to work it out with the finance department.)
