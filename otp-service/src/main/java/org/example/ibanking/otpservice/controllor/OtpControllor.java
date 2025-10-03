package org.example.ibanking.otpservice.controllor;

import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.service.Ipml.OtpServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ibanking/tuition/otp")
public class OtpControllor {

    @Autowired
    private OtpServiceImpl otpServiceImpl;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest) {
        OtpReponse otpReponse = otpServiceImpl.sendOtp(otpRequest);
        return ResponseEntity.ok(otpReponse);
    }
}
