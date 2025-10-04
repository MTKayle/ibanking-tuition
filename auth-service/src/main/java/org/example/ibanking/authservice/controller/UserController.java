package org.example.ibanking.authservice.controller;

import jakarta.transaction.Transactional;
import org.example.ibanking.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Transactional
@RequestMapping("/ibanking/tuition/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/email/{username}")
    public String getEmailByUsername(@PathVariable String username) {
        System.out.println("da nhan" + username);
        return userService.getEmailByUsername(username);
    }

    // For PaymentService orchestrator
    @PostMapping("/{id}/deduct")
    public ResponseEntity<String> deduct(@PathVariable UUID id,
                                         @RequestParam double amount) {
        userService.deductBalance(id, amount);
        return ResponseEntity.ok("DEDUCT_OK");
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<String> refund(@PathVariable UUID id,
                                         @RequestParam double amount) {
        userService.refundBalance(id, amount);
        return ResponseEntity.ok("REFUND_OK");
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<Double> balance(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getBalance(id));
    }
}

