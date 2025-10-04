package org.example.ibanking.authservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDTO {
    private String userid;
    private double balance;

    public UserDTO(UUID id, double balance) {
    }
}
