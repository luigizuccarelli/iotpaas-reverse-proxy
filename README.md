# servisbot-reverse-proxy nginx with auth

## Requirements

- Instance with nginx docker image.

## Build

```bash
docker build -t tfld-docker-prd-local.repo.14west.io/servisbot-reverse-proxy .
docker push tfld-docker-prd-local.repo.14west.io

```

## CICD

The files gocd.goenvironment.json gocd.gopipeline.json are used by the GOCD server to configure the pipeline.

The script gocd-cicd.sh will then be used by the pipline to create a job on openshift to execute the kaniko-job.yml file.

The image will be built and pushde to our PROD jfrog repo.


