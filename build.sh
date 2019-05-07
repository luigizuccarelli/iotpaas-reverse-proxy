#!/bin/sh

cp -r ../portfoliotracker-webcontent/* www/
docker build -t $1/$2:$3 .
