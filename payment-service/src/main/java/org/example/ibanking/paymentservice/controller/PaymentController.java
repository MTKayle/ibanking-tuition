package org.example.ibanking.paymentservice.controller;

import org.example.ibanking.paymentservice.dto.OtpRequest;
import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;
import org.example.ibanking.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ibanking/tuition/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<PaymentResponse> pay(@RequestBody PaymentRequest req) {
        System.out.println("da nhan" + req);
        try {
            PaymentResponse resp = paymentService.payTuition(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            PaymentResponse errorResp = new PaymentResponse();
            errorResp.setTransactionId(null);
            errorResp.setMessage("TIMEOUT or FAILED: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResp);
        }

    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest otpRequest) {
        // Dummy implementation for sending OTP
        Boolean isSent = paymentService.sendOtp(otpRequest); // Assume OTP is sent successfully
        return ResponseEntity.ok("OTP sent to " + otpRequest.getToEmail() + ": " + isSent);
    }

    @GetMapping("/history/{payerid}")
    public ResponseEntity<List<PaymentTransactionEntity>> getPaymentHistory(@PathVariable UUID payerid) {
        List<PaymentTransactionEntity> history = paymentService.getPaymentHistory(payerid);
        return ResponseEntity.ok(history);
    }

}
