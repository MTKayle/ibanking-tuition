package org.example.ibanking.otpservice.service;

import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.dto.VerifyOtpReponse;
import org.example.ibanking.otpservice.dto.VerifyOtpRequest;

public interface OtpService {
    OtpReponse sendOtp(OtpRequest otpRequest);
    VerifyOtpReponse verifyOtp(VerifyOtpRequest verifyOtpRequest);
}
