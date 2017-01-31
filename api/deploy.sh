#! /bin/bash

docker kill socket-api && \
docker rm socket-api && \
docker rmi socket-api && \
docker build -t socket-api . && \
docker run --name socket-api \
  -p 11111:8080 \
  -v ~/Development/projects/websocket-poc/api:/usr/src/app \
  -e "NODE_ENV=dev" \
  -d socket-api run dev