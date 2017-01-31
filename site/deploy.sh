#! /bin/bash

sudo docker kill demo-dashboard && \
sudo docker rm demo-dashboard && \
sudo docker rmi demo-dashboard && \
sudo docker build -t demo-dashboard . && \
sudo docker run --name demo-dashboard \
  -p 10002:3000 \
  -d demo-dashboard