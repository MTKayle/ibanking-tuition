package org.example.ibanking.paymentservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentResponse {
    private String message;
    private UUID transactionId;
    private double amount;
}
