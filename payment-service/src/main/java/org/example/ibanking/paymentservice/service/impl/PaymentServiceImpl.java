package org.example.ibanking.paymentservice.service.impl;

import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.repository.PaymentTransactionRepository;
import org.example.ibanking.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        return null;
    }
}
