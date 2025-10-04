package org.example.ibanking.emailservice.dto;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class EmailRequestOTP {
    private String toEmail;
    private String otp;

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
