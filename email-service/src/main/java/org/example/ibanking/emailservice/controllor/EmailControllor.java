package org.example.ibanking.emailservice.controllor;

import org.example.ibanking.emailservice.dto.EmailReponse;
import org.example.ibanking.emailservice.dto.EmailRequestOTP;
import org.example.ibanking.emailservice.dto.EmailRequestPayment;
import org.example.ibanking.emailservice.service.impl.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ibanking/tuition/email")
public class EmailControllor {

    @Autowired
    private EmailServiceImpl emailServiceImpl;

    @PostMapping("/send-payment-mail")
    public ResponseEntity<EmailReponse> sendEmailPayment(@RequestBody EmailRequestPayment emailRequestPayment) {
        EmailReponse emailReponse = new EmailReponse();
        boolean isSent = emailServiceImpl.sendEmailPayment(emailRequestPayment);
        emailReponse.setSuccess(isSent);
        return ResponseEntity.ok(emailReponse);
    }

    @PostMapping("/send-otp-mail")
    public ResponseEntity<EmailReponse> sendEmailOTP(@RequestBody EmailRequestOTP emailRequestOTP) {
        EmailReponse emailReponse = new EmailReponse();
        boolean isSent = emailServiceImpl.sendEmailOTP(emailRequestOTP);
        emailReponse.setSuccess(isSent);
        return ResponseEntity.ok(emailReponse);
    }
}
