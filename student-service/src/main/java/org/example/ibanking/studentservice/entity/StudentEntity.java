package org.example.ibanking.studentservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;
    @Column(nullable = true, unique = true)
    private String email;
    @Column(nullable = true)
    private String major;
    @Column(nullable = false)
    private double tuitionfee;



    // Getters & Setters

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

    public double getTuitionfee() {
        return tuitionfee;
    }

    public void setTuitionfee(double tuitionfee) {
        this.tuitionfee = tuitionfee;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }
}
