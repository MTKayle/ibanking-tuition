package org.example.ibanking.paymentservice.service;

import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;

public interface PaymentService {
    PaymentResponse payTuititon(PaymentRequest paymentRequest);
}
