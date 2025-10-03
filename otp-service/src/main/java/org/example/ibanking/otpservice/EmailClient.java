package org.example.ibanking.otpservice;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "email-service", url = "http://localhost:8083/ibanking/tuition/email")
public interface EmailClient {
    @PostMapping("/otp")
    EmailReponse sendOtp(@RequestBody EmailRequestOTP emailRequestOTP);
}
