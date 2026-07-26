package com.example.orderprocessingproject.controller;

import com.example.orderprocessingproject.dto.OrderCreatedEvent;
import com.example.orderprocessingproject.entity.Order;
import com.example.orderprocessingproject.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderCreatedEvent event) {
        Order createdOrder = orderService.createOrder(event);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
}