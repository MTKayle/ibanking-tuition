package org.example.ibanking.otpservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class OtpRequest {
    private String toEmail;
    private Long tuitionId;
    private UUID userId;
}
