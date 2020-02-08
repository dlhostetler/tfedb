# first stage - building
FROM clojure:openjdk-11-lein-slim-buster as builder
COPY . /build
WORKDIR /build
RUN lein uberjar

# second stage - packaging
FROM openjdk:11-jre-slim-buster
WORKDIR /root/
COPY --from=builder /build/target/tfedb-data-*-standalone.jar ./tfedb-data.jar

ENTRYPOINT ["java", "-jar", "tfedb-data.jar"]
