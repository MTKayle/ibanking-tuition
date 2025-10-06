package org.example.ibanking.otpservice.dto;

import lombok.Data;
import lombok.Generated;

import java.util.UUID;

@Data
@Generated
public class VerifyOtpRequest {
    private String otp;
    private Long tuitionId;
    private UUID userId;
}
