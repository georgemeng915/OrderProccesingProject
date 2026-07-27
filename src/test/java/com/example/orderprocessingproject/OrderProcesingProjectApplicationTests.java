package com.example.orderprocessingproject;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9092",
        "spring.datasource.url=jdbc:postgresql://localhost:5432/orderdb",
        "spring.datasource.username=postgres",
        "spring.datasource.password=secretpassword"
})
class OrderProcesingProjectApplicationTests {

    @Test
    void contextLoads() {
    }
}