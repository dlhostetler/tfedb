# first stage - building
FROM golang:1.13.7-buster as builder
COPY . /build
WORKDIR /build
# ENV GO111MODULE=on
RUN CGO_ENABLED=0 GOOS=linux go build -o tfedb-api

# second stage - packaging
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /build/tfedb-api ./tfedb-api
CMD ["./tfedb-api"]
