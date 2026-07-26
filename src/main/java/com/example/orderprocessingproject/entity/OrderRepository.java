package com.example.orderprocessingproject.entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    // Spring Data JPA automatically provides methods like save(), findById(), findAll(), etc.
}