package org.example.ibanking.paymentservice.dto;

import lombok.Data;
import lombok.Generated;

import java.util.UUID;

@Data
@Generated
public class OtpRequest {
    private String toEmail;
    private Long tuitionId;
    private UUID userId;

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
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
