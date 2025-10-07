package org.example.ibanking.paymentservice.client;


import org.example.ibanking.paymentservice.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "email-service",
        url = "http://localhost:8083/ibanking/tuition/email",
        configuration = FeignConfig.class
)
public interface EmailClient {


    @PostMapping("/payment")
    ResponseEntity<EmailResponse> sendEmailPayment(@RequestBody EmailRequestPayment emailRequestPayment);

    @PostMapping("/send")
    ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest);


}

