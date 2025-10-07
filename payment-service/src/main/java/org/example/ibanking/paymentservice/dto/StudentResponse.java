package org.example.ibanking.paymentservice.dto;


import lombok.Data;

@Data
public class StudentResponse {

    private Long id;
    private String fullname;
    private String email;
    private String major;
    private double tuitionfee;
    private Long tuitionid;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public double getTuitionfee() {
        return tuitionfee;
    }

    public void setTuitionfee(double tuitionfee) {
        this.tuitionfee = tuitionfee;
    }

    public Long getTuitionid() {
        return tuitionid;
    }

    public void setTuitionid(Long tuitionid) {
        this.tuitionid = tuitionid;
    }
}

