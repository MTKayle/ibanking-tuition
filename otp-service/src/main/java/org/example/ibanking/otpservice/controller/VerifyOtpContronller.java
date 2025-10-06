package org.example.ibanking.otpservice.controller;

import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.dto.VerifyOtpReponse;
import org.example.ibanking.otpservice.dto.VerifyOtpRequest;
import org.example.ibanking.otpservice.service.Ipml.OtpServiceImpl;
import org.example.ibanking.otpservice.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ibanking/tuition/otp")
public class VerifyOtpContronller {

    @Autowired
    private OtpServiceImpl otpServiceImpl;

    @PostMapping("/verify")
    public ResponseEntity<?> sendOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        System.out.println("verifyOtp");
        VerifyOtpReponse verifyOtpReponse = otpServiceImpl.verifyOtp(verifyOtpRequest);
        return ResponseEntity.ok(verifyOtpReponse);
    }
}
