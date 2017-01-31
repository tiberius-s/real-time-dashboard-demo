#! /bin/bash

sudo docker kill demo-socket-api && \
sudo docker rm demo-socket-api && \
sudo docker rmi demo-socket-api && \
sudo docker build -t demo-socket-api . && \
sudo docker run --name demo-socket-api \
  -p 10001:8080 \
  -d demo-socket-api