package org.example.ibanking.authservice.controller;

import jakarta.transaction.Transactional;
import org.example.ibanking.authservice.dto.LoginRequest;
import org.example.ibanking.authservice.dto.LoginResponse;
import org.example.ibanking.authservice.service.AuthService;
import org.example.ibanking.authservice.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Transactional
@RequestMapping("/ibanking/tuition/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login1")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        System.out.println(">>> Received login request: " + request.getUsername());
        LoginResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
