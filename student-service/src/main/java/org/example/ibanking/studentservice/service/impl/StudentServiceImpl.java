package org.example.ibanking.studentservice.service.impl;

import org.example.ibanking.studentservice.dto.StudentResponse;
import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.entity.TuitionEntity;
import org.example.ibanking.studentservice.repository.StudentRepository;
import org.example.ibanking.studentservice.repository.TuitionRepository;
import org.example.ibanking.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TuitionRepository tuitionRepository;

    public StudentResponse getStudentById(Long id) {

        Optional<StudentEntity> studentEntity = studentRepository.findById(id);
        //convert entity to dto
        if (studentEntity.isEmpty() || studentEntity.get().getId() == null) {
            throw new RuntimeException("Student not found");
        }

        TuitionEntity tuition = tuitionRepository.findByStudentIdAndStatus(id, "UNPAID");

        if(tuition == null) {
            throw new RuntimeException("Student already paid");
        }

        StudentResponse studentResponse = new StudentResponse();
        studentResponse.setId(studentEntity.get().getId());
        studentResponse.setFullname(studentEntity.get().getFullname());
        studentResponse.setEmail(studentEntity.get().getEmail());
        studentResponse.setMajor(studentEntity.get().getMajor());
        studentResponse.setTuitionfee(tuition.getTuitionFee());
        studentResponse.setTuitionid(tuition.getId());
        return studentResponse;

    }

    @Transactional
    public void markAsPaid(Long studentId) {
        List<StudentEntity> studentEntity = studentRepository.findAllById(studentId);

        if (studentEntity == null || studentEntity.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        TuitionEntity tuition = tuitionRepository.findByStudentIdAndStatusForUpdate(studentId, "UNPAID");
        if (tuition == null) {
            throw new RuntimeException("Student is already marked as paid");
        }

        tuition.setStatus("PAID");
        tuitionRepository.save(tuition);
    }


}