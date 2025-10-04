package org.example.ibanking.studentservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tuition_fees")
public class TuitionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double tuitionFee;

    @Column(nullable = false)
    private String status;

    // N tuition fees -> 1 student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false) // foreign key
    private StudentEntity student;

    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(double tuitionFee) { this.tuitionFee = tuitionFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public StudentEntity getStudent() { return student; }
    public void setStudent(StudentEntity student) { this.student = student; }
}
