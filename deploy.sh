#!/bin/bash
docker build -t wle8300/aloe .
docker push wle8300/aloe

ssh deploy@$DEPLOY_SERVER << EOF
docker pull wle8300/aloe
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi wle8300/aloe:current || true
docker tag wle8300/aloe:latest wle8300/aloe:current
docker run -d --restart always --name api-boilerplate -p 8000:8000 wle8300/aloe:current
EOF
