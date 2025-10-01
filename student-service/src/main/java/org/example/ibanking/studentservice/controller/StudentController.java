package org.example.ibanking.studentservice.controller;

import org.example.ibanking.studentservice.dto.StudentResponse;
import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ibanking/tuition/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        System.out.println("getStudentById");
        StudentResponse student = studentService.getStudentById(id);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();

    }
}
