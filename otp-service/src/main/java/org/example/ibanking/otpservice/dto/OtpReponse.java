package org.example.ibanking.otpservice.dto;

import lombok.Data;

@Data
public class OtpReponse {
    private boolean success;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
