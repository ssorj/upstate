# Upstate

Upstate is a messaging app demonstrating the use of a shared work
queue and multiple workers.

The backend workers are implemented three different ways - in Node.js,
Spring, and Vert.x.  The frontend is a single-page web application.
The web server communicates over HTTP with the browser and over
AMQP 1.0 with the workers.

Upstate is designed to run on OpenShift or any other variety of
Kubernetes.

## Components

 - **Web server** - [server.js](web-nodejs/server.js)
 - **Node.js worker** - [server.js](worker-nodejs/server.js)
 - **Spring worker** - [SpringWorker.java](worker-spring/src/main/java/org/amqphub/upstate/spring/SpringWorker.java)
 - **Vert.x worker** - [VertxWorker.java](worker-vertx/src/main/java/org/amqphub/upstate/vertx/VertxWorker.java)

## Common configuration

    MESSAGING_SERVICE_HOST
    MESSAGING_SERVICE_PORT
