package org.example.ibanking.otpservice.dto;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class VerifyOtpReponse {
    private boolean success;
    private String message;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
