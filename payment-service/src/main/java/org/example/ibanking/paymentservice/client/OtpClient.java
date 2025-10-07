package org.example.ibanking.paymentservice.client;

import org.example.ibanking.paymentservice.dto.OtpRequest;
import org.example.ibanking.paymentservice.dto.VerifyOtpRequest;
import org.example.ibanking.paymentservice.dto.VerifyOtpResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "otp-service",
        url = "http://localhost:8086/ibanking/tuition/otp",
        configuration = FeignConfig.class
)
public interface OtpClient {




        @PostMapping("/verify")
        ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest);

        @PostMapping("/send")
        ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest);


}
