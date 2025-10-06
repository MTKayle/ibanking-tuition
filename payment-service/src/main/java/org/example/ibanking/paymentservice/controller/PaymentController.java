package org.example.ibanking.paymentservice.controller;

import org.example.ibanking.paymentservice.dto.OtpRequest;
import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ibanking/tuition/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> pay(@RequestBody PaymentRequest req) {
        System.out.println("da nhan" + req);
        PaymentResponse resp = paymentService.payTuititon(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest otpRequest) {
        // Dummy implementation for sending OTP
        Boolean isSent = paymentService.sendOtp(otpRequest); // Assume OTP is sent successfully
        return ResponseEntity.ok("OTP sent to " + otpRequest.getToEmail() + ": " + isSent);
    }

}
