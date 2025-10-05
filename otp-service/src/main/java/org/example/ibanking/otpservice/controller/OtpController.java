package org.example.ibanking.otpservice.controller;

import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.service.Ipml.OtpServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ibanking/tuition/otp")
public class OtpController {

    @Autowired
    private OtpServiceImpl otpServiceImpl;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest) {
        OtpReponse otpReponse = otpServiceImpl.sendOtp(otpRequest);
        return ResponseEntity.ok(otpReponse);
    }
}
