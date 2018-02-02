//
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
//

"use strict";

const rhea = require("rhea");

const amqp_host = process.env.MESSAGING_SERVICE_HOST || "localhost";
const amqp_port = process.env.MESSAGING_SERVICE_PORT || 5672;

const id = Math.floor(Math.random() * (10000 - 1000)) + 1000;
const container = rhea.create_container({id: "worker-nodejs-" + id});

var worker_status_sender = null;
var requests_processed = 0;

function process_request(request) {
    return request.body.toUpperCase();
}

container.on("connection_open", function (event) {
    event.connection.open_receiver("upstate/requests");
    worker_status_sender = event.connection.open_sender("upstate/worker-status");
});

container.on("message", function (event) {
    var request = event.message;

    console.log("WORKER-NODEJS: Received request '%s'", request.body);

    try {
        var response_body = process_request(request);
    } catch (e) {
        console.error("WORKER-NODEJS: Failed processing message: %s", e);
        return;
    }

    console.log("WORKER-NODEJS: Sending response '%s'", response_body);

    var response = {
        to: request.reply_to,
        correlation_id: request.id,
        application_properties: {
            worker_id: container.id
        },
        body: response_body
    };

    event.connection.send(response);

    requests_processed++;
});

function send_status_update() {
    if (!worker_status_sender || !worker_status_sender.sendable()) {
        return;
    }

    console.log("WORKER-NODEJS: Sending status update");

    var status = {
        application_properties: {
            worker_id: container.id,
            timestamp: new Date().getTime(),
            requests_processed: requests_processed
        }
    };

    worker_status_sender.send(status);
}

setInterval(send_status_update, 5 * 1000);

container.connect({host: amqp_host, port: amqp_port});

console.log("Connected to AMQP messaging service at %s:%s", amqp_host, amqp_port);
