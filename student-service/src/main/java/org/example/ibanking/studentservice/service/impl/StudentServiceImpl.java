package org.example.ibanking.studentservice.service.impl;

import org.example.ibanking.studentservice.dto.StudentResponse;
import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.entity.TuitionEntity;
import org.example.ibanking.studentservice.repository.StudentRepository;
import org.example.ibanking.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public StudentResponse getStudentById(Long id) {

        StudentEntity studentEntity = studentRepository.findByIdAndStatus(id, "UNPAID");
        //convert entity to dto
        if (studentEntity == null) {
            throw new RuntimeException("Student not found");
        }

        StudentResponse student = new StudentResponse();
        student.setId(studentEntity.getId());
        student.setFullname(studentEntity.getFullname());
        student.setEmail(studentEntity.getEmail());
        student.setMajor(studentEntity.getMajor());
        student.setTuitionfee(studentEntity.getTuitionFees().stream().mapToDouble(TuitionEntity::getTuitionFee).sum());
        student.setTuitionid(String.valueOf(studentEntity.getTuitionFees().get(0).getId()));
        return student;

    }


}