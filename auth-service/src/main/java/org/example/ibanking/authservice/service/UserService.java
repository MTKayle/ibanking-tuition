package org.example.ibanking.authservice.service;

import org.example.ibanking.authservice.dto.UserDTO;

import java.util.UUID;

public interface UserService {
    String getEmailByUsername(String username);

    void deductBalance(UUID userId, double amount);

    void refundBalance(UUID userId, double amount);

    double getBalance(UUID userId);
}
