package org.example.ibanking.paymentservice.dto;



import lombok.Data;
import lombok.Generated;

import java.time.LocalDateTime;

@Data
@Generated
public class EmailRequestPayment {
    private String toEmail;
    private Long studentId;
    private String nameStudent;
    private String major;
    private LocalDateTime dateTime;

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getNameStudent() {
        return nameStudent;
    }

    public void setNameStudent(String nameStudent) {
        this.nameStudent = nameStudent;
    }


    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}
