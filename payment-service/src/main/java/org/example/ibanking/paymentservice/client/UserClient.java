package org.example.ibanking.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "auth-service", url = "${services.user.url:http://localhost:8082}")
public interface UserClient {
    // Define methods to interact with the Auth Service
    @PostMapping("/ibanking/tuition/users/internal/{id}/deduct")
    ResponseEntity<String> deduct(@PathVariable("id") UUID id, @RequestParam double amount);

    @PostMapping("/ibanking/tuition/users/internal/{id}/refund")
    ResponseEntity<String> refund(@PathVariable("id") UUID id, @RequestParam double amount);
}
