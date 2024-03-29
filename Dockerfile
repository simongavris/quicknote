FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY script.js /usr/share/nginx/html/script.js
COPY registerServiceWorker.js /usr/share/nginx/html/registerServiceWorker.js
COPY serviceWorker.js /usr/share/nginx/html/serviceWorker.js