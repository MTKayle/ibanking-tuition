package org.example.ibanking.paymentservice.service;

import org.example.ibanking.paymentservice.dto.OtpRequest;
import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.dto.VerifyOtpRequest;

public interface PaymentService {
    PaymentResponse payTuititon(PaymentRequest paymentRequest);
    boolean sendOtp(OtpRequest otpRequest);
    boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);

}
