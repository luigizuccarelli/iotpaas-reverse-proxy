FROM nginx
COPY nginx/conf.d/* /etc/nginx/conf.d/
COPY nginx/nginx.conf /etc/nginx/
COPY www/ /usr/share/nginx/html/
COPY uid_entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/uid_entrypoint.sh && \ 
    chmod -R 777 /var/log/nginx && chmod -R 777 /var/cache/nginx && chown -R 1001 /var/log/nginx && chown -R 1001:1001 /var/cache/nginx  

EXPOSE 8080 8000

USER 1001

ENTRYPOINT [ "/usr/local/bin/uid_entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
