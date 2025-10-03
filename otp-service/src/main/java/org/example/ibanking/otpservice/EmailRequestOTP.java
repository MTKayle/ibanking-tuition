package org.example.ibanking.otpservice;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class EmailRequestOTP {
    private String toEmail;
    private String otp;
}
