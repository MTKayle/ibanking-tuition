package org.example.ibanking.otpservice.dto;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class VerifyOtpRequest {
    private String otp;
    private Long tuitionId;
}
