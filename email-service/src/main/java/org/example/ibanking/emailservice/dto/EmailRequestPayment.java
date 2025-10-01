package org.example.ibanking.emailservice.dto;

import lombok.Data;
import lombok.Generated;

import java.time.LocalDateTime;

@Data
@Generated
public class EmailRequestPayment {
    private String toEmail;
    private String studentId;
    private String nameStudent;
    private String major;
    private LocalDateTime dateTime;
}
