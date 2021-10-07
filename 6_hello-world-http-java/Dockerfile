# Taken from: https://docs.docker.com/language/java/build-images/
FROM openjdk:16-alpine3.13

WORKDIR /app

# You should always try this since keeping your dependencies and application code separate
# is a _great_ idea. In java just like every other example.
# However this has _never_ worked in any of my java projects.
# I hope that it has gotten better.
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]