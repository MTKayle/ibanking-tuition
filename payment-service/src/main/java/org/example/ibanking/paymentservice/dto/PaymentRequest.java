package org.example.ibanking.paymentservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentRequest {
    private Long studentId;
    private UUID PayerId;
    private double amount;

}
