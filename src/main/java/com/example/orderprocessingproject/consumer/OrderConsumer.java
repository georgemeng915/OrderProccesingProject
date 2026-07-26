package com.example.orderprocessingproject.consumer;

import com.example.orderprocessingproject.dto.OrderCreatedEvent;
import com.example.orderprocessingproject.entity.Order;
import com.example.orderprocessingproject.entity.OrderRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderConsumer {

    private final OrderRepository orderRepository;

    // Constructor injection for the repository
    public OrderConsumer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @KafkaListener(topics = "orders-topic", groupId = "order-processor-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        try {
            System.out.println("----------------------------------------");
            System.out.println(" [CONSUMER] Received Order Created Event!");
            System.out.println(" Order ID    : " + event.getOrderId());
            System.out.println("----------------------------------------");

            // Pass the String ID directly into findById
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + event.getOrderId()));

            order.setStatus("PROCESSING");
            orderRepository.save(order);

            System.out.println(" [CONSUMER] Order status updated to PROCESSING in database!");

        } catch (Exception e) {
            System.err.println(" [CONSUMER ERROR] Failed to process order event: " + e.getMessage());
            e.printStackTrace();
        }
    }
}