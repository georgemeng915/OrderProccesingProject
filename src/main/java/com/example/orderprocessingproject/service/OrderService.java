package com.example.orderprocessingproject.service;

import com.example.orderprocessingproject.dto.OrderCreatedEvent;
import com.example.orderprocessingproject.entity.Order;
import com.example.orderprocessingproject.entity.OrderRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    private static final String TOPIC = "orders-topic";

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Order createOrder(OrderCreatedEvent event) {
        // 1. Generate unique order ID if not provided
        if (event.getOrderId() == null || event.getOrderId().isEmpty()) {
            event.setOrderId(UUID.randomUUID().toString());
        }

        // 2. Save order to PostgreSQL with a PENDING status
        Order order = new Order(
                event.getOrderId(),
                event.getItemSku(),
                event.getQuantity(),
                event.getTotalPrice(),
                event.getStatus()
        );
        Order savedOrder = orderRepository.save(order);

        // 3. Publish the event to Kafka so the Inventory Service can pick it up
        kafkaTemplate.send(TOPIC, event.getOrderId(), event);

        return savedOrder;
    }
}