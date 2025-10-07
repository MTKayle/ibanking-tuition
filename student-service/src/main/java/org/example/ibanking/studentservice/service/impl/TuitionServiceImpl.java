package org.example.ibanking.studentservice.service.impl;

import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.entity.TuitionEntity;
import org.example.ibanking.studentservice.repository.StudentRepository;
import org.example.ibanking.studentservice.repository.TuitionRepository;
import org.example.ibanking.studentservice.service.TuitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TuitionServiceImpl implements TuitionService {

    @Autowired
    private TuitionRepository tuitionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Transactional
    public void markAsPaid(Long studentId, Long tuitionId) {
        List<StudentEntity> studentEntity = studentRepository.findAllById(studentId);

        if (studentEntity == null || studentEntity.isEmpty()) {
            throw new RuntimeException("Student not found");
        }

        TuitionEntity tuition = tuitionRepository.findByIdAndStudentIdForUpdate(studentId, tuitionId);
        if (tuition == null || !"PENDING".equals(tuition.getStatus()) ||
            "PAID".equals(tuition.getStatus())) {
            throw new RuntimeException("Student is already marked as paid");
        }

        tuition.setStatus("PAID");
        tuitionRepository.save(tuition);
    }

    @Transactional
    public boolean isUnpaid(Long tuitionId) {
        TuitionEntity tuition = tuitionRepository.findByIdForUpdate(tuitionId);
        if (tuition == null) {
            throw new RuntimeException("Tuition not found");
        }
        if(!"UNPAID".equals(tuition.getStatus())) {
            throw new RuntimeException("Tuition is already paid");
        }

        tuition.setStatus("PENDING");
        tuitionRepository.save(tuition);

        return true;
    }

    @Transactional
    public void setUnpaid(Long tuitionId) {
        TuitionEntity tuition = tuitionRepository.findByIdForUpdate(tuitionId);
            tuition.setStatus("UNPAID");
            tuitionRepository.save(tuition);

    }
}
