/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

"use strict";

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

Element.prototype.$ = function () {
  return this.querySelector.apply(this, arguments);
};

Element.prototype.$$ = function () {
  return this.querySelectorAll.apply(this, arguments);
};

var upstate = {
    openRequest: function (method, url, handler) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                handler(request);
            }
        };

        request.open(method, url);

        return request;
    },

    minFetchDataInterval: 500,
    maxFetchDataInterval: 60 * 1000,
    currentFetchDataInterval: null,
    currentTimeoutId: null,
    data: {},

    fetchData: function () {
        console.log("Fetching data");

        var request = upstate.openRequest("GET", "/data", function (request) {
            if (request.status === 200) {
                upstate.data = JSON.parse(request.responseText);
                upstate.fireStateChangeEvent();
            }
        });

        request.send(null);
    },

    fireStateChangeEvent: function () {
        window.dispatchEvent(new Event("statechange"));
    },

    fetchDataPeriodically: function () {
        window.clearTimeout(upstate.currentTimeoutId);
        upstate.currentFetchDataInterval = upstate.minFetchDataInterval;

        upstate.doFetchDataPeriodically();
    },

    doFetchDataPeriodically: function () {
        upstate.currentTimeoutId = window.setTimeout(upstate.doFetchDataPeriodically, upstate.currentFetchDataInterval);
        upstate.currentFetchDataInterval = Math.floor(upstate.currentFetchDataInterval * 2, upstate.maxFetchDataInterval);

        upstate.fetchData();
    },

    sendRequest: function() {
        console.log("Sending request");

        var request = upstate.openRequest("POST", "/send-request", function (request) {
            if (request.status === 200) {
                upstate.fetchDataPeriodically();
            }
        });

        var data = JSON.stringify({text: $("#request-form").text.value});

        request.setRequestHeader("Content-type", "application/json");
        request.send(data);

        $("#request-form").reset();
    },

    renderResponses: function (data) {
        console.log("Rendering responses");

        var oldContent = $("#responses");
        var newContent = document.createElement("pre");

        var lines = [];

        for (var response of data.responses) {
            lines.unshift("<b>" + response[0] + ":</b> " + response[1]);
        }

        newContent.innerHTML = lines.join("\n");
        newContent.setAttribute("id", "responses");

        oldContent.parentNode.replaceChild(newContent, oldContent);
    },

    init: function () {
        window.addEventListener("statechange", function (event) {
            upstate.renderResponses(upstate.data);
        });

        window.addEventListener("load", function (event) {
            upstate.fetchDataPeriodically();
         });
    }
}
