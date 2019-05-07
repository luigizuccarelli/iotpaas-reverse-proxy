# nginx-portfolio-tracker
Use of lzuccarelli/nginx-centos7: latest image that mounts the files in this repo to override config and base html

## Requirements

- Instance with centos7 created and ssh access enabled.

## Components

- portfoliotracker-middlewareinterface
- portfoliotracker-stocks-dbinterface
- portfoliotracker-stocks-grapinterface
- redis
- mongodb
- nginx

## Docker

Before executing docker compose ensure that the file nginx/conf/default.conf is properly setup

The config files can be changed to fine tune nginx - remember a restart is needed for any config change

**N.B** copy the contents of the folder portfoliotracker-webcontent to portfoliotracker-webserver before building

Execute this command (linux)

```bash
# copy contents (assume you ar in the base directory portfolio-tracker)
cp -r portfoliotracker-webcontent/* portfoliotracker-webserver/www/

# build the nginx image
docker build -t <username>/portfoliotracker-nginx:latest .
```

## Testing

Execute the following command
```bash

docker run -d --rm --name mongodb-service -p 27017:27017 -e MONGODB_USER=profile -e MONGODB_PASSWORD=profile -e MONGODB_DATABASE=test -e MONGODB_ADMIN_PASSWORD=admin -v <path-to_portfoliotracker>/Data:/var/lib/mongodb/data <username>/mongodb:latest
docker run -d --rm --name redis_database -p 6379:6379  centos/redis-32-centos7
docker run -it --name dbservice --link redis_database -p 9000:9000 <username>/portfoliotracker-dbinterface:1.11.0
docker run -it --name graphservice --link redis_database -p 9001:9001 <username>/portfoliotracker-graphinterface:1.11.0
docker run -it --name middlewareservice --link redis_database -p 9002:9002 <username>/portfoliotracker-middlewareinterface:1.11.0
docker run -d --rm --link dbserver --link graphservice --link middlewareservice -v <path-to-portfoliotracker>/nginx/:/etc/nginx -p 8080:8080 -v /<path-to-portfoliotracker>//www/:/usr/share/nginx/html <username>/portfoliotracker-nginx:latest

```

