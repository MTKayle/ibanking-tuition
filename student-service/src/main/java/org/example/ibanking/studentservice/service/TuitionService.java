package org.example.ibanking.studentservice.service;

public interface TuitionService {
    void markAsPaid(Long id, Long tuitionId);
    boolean isUnpaid(Long tuitionId);
}
