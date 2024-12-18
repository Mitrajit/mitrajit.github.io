Simple redis deployment documentation using docker
# Installation
1. Install [docker](https://docs.docker.com/engine/install/).
2. Pull redis image and run the container
```shell
docker run -d \
  --restart=always \
  --name redis-container \
  -p 6379:6379 \
  -v /path-for/rdb:/data \
  redis:latest redis-server --requirepass secretpassword
```
# Gracefully shutting down
```shell
docker update --restart=no redis-container
docker exec redis-container redis-cli SHUTDOWN SAVE
docker update --restart=always redis-container
```
