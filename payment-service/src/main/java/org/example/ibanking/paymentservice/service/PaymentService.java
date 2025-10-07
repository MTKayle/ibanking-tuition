package org.example.ibanking.paymentservice.service;

import org.example.ibanking.paymentservice.dto.OtpRequest;
import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.dto.VerifyOtpRequest;
import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    PaymentResponse payTuition(PaymentRequest paymentRequest);
    boolean sendOtp(OtpRequest otpRequest);
    boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);
    List<PaymentTransactionEntity> getPaymentHistory(UUID payerid);

}
