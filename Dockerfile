#FROM centos:latest
FROM registry.access.redhat.com/ubi8/ubi-init:latest

LABEL maintainer="Luigi Zuccarelli <luigizuccarelli@gmail.com>"

# Labels consumed by Red Hat build service
LABEL Component="nginx" \
      Name="rhel8/nginx" \
      Version="1.16.1" \
      Release="1"

# Labels could be consumed by OpenShift
LABEL io.k8s.description="nginx [engine x] is an HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server, originally written by Igor Sysoev." \
      io.k8s.display-name="nginx 1.16.1" \
      io.openshift.expose-services="80:http" \
      io.openshift.tags="nginx"


ENV nginxversion="1.16.1-1" \
    os="rhel" \
    osversion="8" \
    elversion="8"

RUN yum install -y wget openssl openssl-devel sed &&\
    yum -y autoremove &&\
    yum clean all &&\
    wget http://nginx.org/packages/$os/$osversion/x86_64/RPMS/nginx-$nginxversion.el$elversion.ngx.x86_64.rpm &&\
    rpm -iv nginx-$nginxversion.el$elversion.ngx.x86_64.rpm &&\
    sed -i '1i\
    daemon off;\
    ' /etc/nginx/nginx.conf &&\
    rm -rf nginx-$nginxversion.el$elversion.ngx.x86_64.rpm 

COPY nginx/conf.d/* /etc/nginx/conf.d/
COPY nginx/nginx.conf /etc/nginx/
COPY www/ /usr/share/nginx/html/
COPY uid_entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/uid_entrypoint.sh && \ 
    chmod -R 777 /var/log/nginx && chmod -R 777 /var/cache/nginx && chmod -R 777 /var/run && \
    chown -R 1001 /var/log/nginx && chown -R 1001:1001 /var/cache/nginx  

EXPOSE 8080 8000

USER 1001

ENTRYPOINT [ "uid_entrypoint.sh" ]

CMD ["nginx"]
