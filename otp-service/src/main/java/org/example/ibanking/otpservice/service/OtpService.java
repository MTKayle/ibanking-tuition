package org.example.ibanking.otpservice.service;

import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;

public interface OtpService {
    OtpReponse sendOtp(OtpRequest otpRequest);
}
