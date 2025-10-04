package org.example.ibanking.studentservice.dto;

import lombok.Data;

@Data
public class StudentResponse {

    private Long id;
    private String fullname;
    private String email;
    private String major;
    private double tuitionfee;
    private String tuitionid;

}
