package org.example.ibanking.paymentservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentResponse {
    private String message;
    private UUID transactionId;
    private double amount;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
