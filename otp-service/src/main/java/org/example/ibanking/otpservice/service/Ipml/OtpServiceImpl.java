package org.example.ibanking.otpservice.service.Ipml;

import lombok.RequiredArgsConstructor;
import org.example.ibanking.otpservice.EmailClient;
import org.example.ibanking.otpservice.EmailReponse;
import org.example.ibanking.otpservice.EmailRequestOTP;
import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.reponsitory.OtpReponsitory;
import org.example.ibanking.otpservice.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpReponsitory otpReponsitory;

    @Autowired
    private final EmailClient emailClient;
    @Override
    public OtpReponse sendOtp(OtpRequest otpRequest) {
        EmailReponse emailReponse = new EmailReponse();
        EmailRequestOTP emailRequestOTP = new EmailRequestOTP();
        String toEmail = otpRequest.getToEmail();
        String otp = "123456";
        emailRequestOTP.setToEmail(toEmail);
        emailRequestOTP.setOtp(otp);
        OtpReponse otpReponse = new OtpReponse();
        System.out.println(emailRequestOTP.getToEmail());
        System.out.println(emailRequestOTP.getOtp());
        emailReponse = emailClient.sendOtp(emailRequestOTP);
        otpReponse.setSuccess(emailReponse.isSuccess());
        return otpReponse;
    }
}
