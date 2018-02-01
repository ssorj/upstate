/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.amqphub.upstate.vertx;

import io.vertx.core.AsyncResult;
import io.vertx.core.Vertx;
import io.vertx.proton.ProtonClient;
import io.vertx.proton.ProtonConnection;
import io.vertx.proton.ProtonSender;

//import org.apache.qpid.proton.amqp.messaging.AmqpValue;
//import org.apache.qpid.proton.amqp.messaging.Section;
import org.apache.qpid.proton.message.Message;

public class Worker {
    public static void main(String[] args) {
        Vertx vertx = Vertx.vertx();
        ProtonClient client = ProtonClient.create(vertx);

        client.connect("localhost", 5672, (connectResult) -> {
                checkResult(connectResult);

                ProtonConnection conn = connectResult.result();
                conn.setContainer("worker-vertx-9999");

                conn.openHandler((openResult) -> {
                        checkResult(openResult);

                        doStuff(openResult.result());
                    });
            });
    }

    private static void doStuff(ProtonConnection conn) {
        System.out.println("SUCCESS");
    }

    private static void checkResult(AsyncResult result) {
        if (result.failed()) {
            throw new IllegalStateException(result.cause());
        }
    }
}
