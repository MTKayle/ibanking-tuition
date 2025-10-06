package org.example.ibanking.paymentservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PaymentRequest {
    private Long studentid;
    private UUID payerid;
    private Long tuitionid;
    private double amount;
    private String otp;

    public Long getStudentid() {
        return studentid;
    }

    public void setStudentid(Long studentid) {
        this.studentid = studentid;
    }

    public UUID getPayerid() {
        return payerid;
    }

    public void setPayerid(UUID payerid) {
        this.payerid = payerid;
    }

    public Long getTuitionid() {
        return tuitionid;
    }

    public void setTuitionid(Long tuitionid) {
        this.tuitionid = tuitionid;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getOtp() {
        return otp;
    }
    public void setOtp(String otp) {
        this.otp = otp;
    }




}
