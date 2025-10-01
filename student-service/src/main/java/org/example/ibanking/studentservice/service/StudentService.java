package org.example.ibanking.studentservice.service;

import org.example.ibanking.studentservice.dto.StudentResponse;

public interface StudentService {
    StudentResponse getStudentById(Long id);
}
