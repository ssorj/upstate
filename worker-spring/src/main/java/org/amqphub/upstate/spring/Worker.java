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

package org.amqphub.upstate.spring;

import javax.jms.ConnectionFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jms.DefaultJmsListenerContainerFactoryConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.support.JmsHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@SpringBootApplication
@EnableJms
public class Worker {
    private static String id = "worker-spring-" +
        (Math.round(Math.random() * (10000 - 1000)) + 1000);

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory
    (ConnectionFactory connectionFactory, DefaultJmsListenerContainerFactoryConfigurer configurer) {
        DefaultJmsListenerContainerFactory listenerFactory
            = new DefaultJmsListenerContainerFactory();
        configurer.configure(listenerFactory, connectionFactory);
        listenerFactory.setTransactionManager(null);
        listenerFactory.setSessionTransacted(false);
        listenerFactory.setClientId(id);
        return listenerFactory;
    }

    @Component
    static class MessageHandler {
        @JmsListener(destination = "upstate/requests")
        private Message<String> handleRequest(Message<String> request) {
            System.out.println("WORKER-SPRING: Received request '" + request.getPayload() + "'");

            String responsePayload;

            try {
                responsePayload = processRequest(request);
            } catch (Exception e) {
                System.err.println("WORKER-SPRING: Failed processing message: " + e);
                return null;
            }

            System.out.println("WORKER-SPRING: Sending response '" + responsePayload + "'");

            Message<String> response = MessageBuilder.withPayload(responsePayload)
                .setHeader(JmsHeaders.CORRELATION_ID, request.getHeaders().get(MessageHeaders.ID))
                .setHeader("worker_id", id)
                .build();

            return response;
        }

        private String processRequest(Message<String> request) {
            return request.getPayload().toUpperCase();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Worker.class, args);
    }
}
