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

const body_parser = require("body-parser");
const express = require("express");
const rhea = require("rhea");

const http_host = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const http_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

const amqp_host = process.env.MESSAGING_SERVICE_HOST || "localhost";
const amqp_port = process.env.MESSAGING_SERVICE_PORT || 5672;

// AMQP

const id = Math.floor(Math.random() * (10000 - 1000)) + 1000;
const container = rhea.create_container({id: "web-nodejs-" + id});

var sender = null;
var receiver = null;

const requests = [];
const responses = [];

var request_sequence = 0;

function send_requests() {
    if (!receiver) {
        return;
    }
    
    while (sender.sendable() && requests.length > 0) {
        var message = {
            id: request_sequence++,
            reply_to: receiver.source.address,
            body: requests.shift()
        };
        
        sender.send(message);

        console.log("WEB: Sent request '%s'", message.body);
    }
}

container.on("connection_open", function (event) {
    sender = event.connection.open_sender("upstate/requests");
    receiver = event.connection.open_receiver({source: {dynamic: true}});
});

container.on("sendable", function (event) {
    send_requests();
});

container.on("message", function (event) {
    var message = event.message;
    responses.push([message.application_properties.worker_id, message.body]);

    console.log("WEB: Received response '%s'", message.body);
});

container.connect({host: amqp_host, port: amqp_port});

console.log("Connected to AMQP messaging service at %s:%s", amqp_host, amqp_port);

// HTTP

function render_responses() {
    var elems = [];

    elems.push("<ul>");
    
    for (var response of responses) {
        elems.push("<li>" + response[1] + "</li>\n");
    }

    elems.push("</ul>");
    
    return elems.join("\n");
}

const app = express();

app.use(express.static("static"));
app.use(body_parser.json());

app.post("/send-request", function (req, res) {
    requests.push(req.body.text);
    send_requests();
    
    res.redirect("/");
});

app.get("/data", function (req, res) {
    res.json({responses: responses});
});

app.listen(http_port, http_host);

console.log("Listening for new HTTP connections at %s:%s", http_host, http_port);
