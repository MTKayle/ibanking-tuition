package org.example.ibanking.studentservice.service;

import org.example.ibanking.studentservice.dto.StudentResponse;
import org.example.ibanking.studentservice.entity.StudentEntity;

public interface StudentService {
    StudentResponse getStudentById(Long id);

    StudentResponse getStudentPaidById(Long id);

}
