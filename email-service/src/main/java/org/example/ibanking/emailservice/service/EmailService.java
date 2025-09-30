package org.example.ibanking.emailservice.service;


import org.example.ibanking.emailservice.dto.EmailRequestOTP;
import org.example.ibanking.emailservice.dto.EmailRequestPayment;

public interface EmailService {
    boolean sendEmailPayment(EmailRequestPayment emailRequestPayment);
    boolean sendEmailOTP(EmailRequestOTP emailRequestPayment);
}
