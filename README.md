# common-reverse-proxy nginx with auth

## Requirements

- Instance with nginx docker image.

## Build

```bash
podman build -t quay.io/<user>/iotpaas-reverse-proxy:latest .
podman push quay.io/<user>iotpaas-reverse-proxy:latest

```
