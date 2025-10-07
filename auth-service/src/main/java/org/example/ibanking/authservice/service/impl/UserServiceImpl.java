package org.example.ibanking.authservice.service.impl;

import org.example.ibanking.authservice.dto.UserDTO;
import org.example.ibanking.authservice.entity.UserEntity;
import org.example.ibanking.authservice.repository.UserRepository;
import org.example.ibanking.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public String getEmailByUsername(String username) {
        // Dummy implementation for example purposes
        UserEntity user = userRepository.findByUsername(username);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        return user.getEmail();
    }

    // Deduct balance in one transaction (lock -> check -> update)
    @Transactional
    public void deductBalance(UUID userId, double amount) {
        UserEntity user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
    }

    // Compensating action: refund balance (idempotent if called multiple times? see note)
    @Transactional
    public void refundBalance(UUID userId, double amount) {
        UserEntity user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
    }

    // read-only
    @Transactional(readOnly = true)
    public double getBalance(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getBalance();
    }
}
