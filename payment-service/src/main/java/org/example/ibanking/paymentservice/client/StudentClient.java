package org.example.ibanking.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "student-service", url = "${services.student.url:http://localhost:8084}")
public interface StudentClient {

    @PostMapping("/ibanking/tuition/students/internal/{id}/mark-paid")
    ResponseEntity<String> markPaid(@RequestParam Long studentId, @PathVariable("id") Long tuitionId);

    @GetMapping("/ibanking/tuition/students/internal/{id}/status")
    ResponseEntity<Boolean> status(@PathVariable("id") Long tuitionId);

}
