package org.example.ibanking.paymentservice.dto;


import lombok.Data;
import lombok.Generated;

import java.util.UUID;

@Data
@Generated
public class VerifyOtpRequest {
    private String otp;
    private Long tuitionId;
    private UUID userId;

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public Long getTuitionId() {
        return tuitionId;
    }

    public void setTuitionId(Long tuitionId) {
        this.tuitionId = tuitionId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}

