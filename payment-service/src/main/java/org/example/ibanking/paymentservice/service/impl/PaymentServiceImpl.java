package org.example.ibanking.paymentservice.service.impl;

import org.example.ibanking.paymentservice.client.StudentClient;
import org.example.ibanking.paymentservice.client.UserClient;
import org.example.ibanking.paymentservice.dto.PaymentRequest;
import org.example.ibanking.paymentservice.dto.PaymentResponse;
import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;
import org.example.ibanking.paymentservice.repository.PaymentTransactionRepository;
import org.example.ibanking.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    /**
     * Orchestrates saga:
     * 1) deduct on user
     * 2) mark student as paid
     * 3) if step2 fails -> refund user
     * 4) if both ok -> write transaction record
     */

    public PaymentResponse payTuititon(PaymentRequest paymentRequest) {
        //1) deduct on user
        // check tuition status first
        ResponseEntity<String> statusResponse = studentClient.status(paymentRequest.getTuitionid());
        if(statusResponse.getStatusCode().is2xxSuccessful()){
            String status = statusResponse.getBody();
            if("PAID".equals(status)){
                throw new RuntimeException("Tuition is already paid");
            }
        }

        //  2) mark student as paid
        // deduct balance (transactional in user service)
        try {
            userClient.deduct(paymentRequest.getPayerid(), paymentRequest.getAmount());
        } catch (Exception e) {
            // ❌ Deduct fail -> ghi transaction FAILED
            PaymentTransactionEntity failTxn = new PaymentTransactionEntity();
            failTxn.setPayerid(paymentRequest.getPayerid());
            failTxn.setStudentid(paymentRequest.getStudentid());
            failTxn.setAmount(paymentRequest.getAmount());
            failTxn.setStatus("FAILED_DEDUCT");
            paymentTransactionRepository.save(failTxn);
            throw new RuntimeException("Failed to deduct user balance: " + e.getMessage());
        }

        // mark as paid (transactional in student service)
        try {
            studentClient.markPaid(paymentRequest.getStudentid(), paymentRequest.getTuitionid());
        } catch (Exception e) {
            // 3) if step2 fails -> refund user
            // compensate: refund
            try {
                userClient.refund(paymentRequest.getPayerid(), paymentRequest.getAmount());

                // Ghi transaction FAILED_MARKPAID
                PaymentTransactionEntity failTxn = new PaymentTransactionEntity();
                failTxn.setPayerid(paymentRequest.getPayerid());
                failTxn.setStudentid(paymentRequest.getStudentid());
                failTxn.setAmount(paymentRequest.getAmount());
                failTxn.setStatus("FAILED_MARKPAID_REFUNDED");
                paymentTransactionRepository.save(failTxn);
            } catch (Exception ex) {
                // log error

                // refund cũng fail -> ghi trạng thái đặc biệt
                PaymentTransactionEntity criticalTxn = new PaymentTransactionEntity();
                criticalTxn.setPayerid(paymentRequest.getPayerid());
                criticalTxn.setStudentid(paymentRequest.getStudentid());
                criticalTxn.setAmount(paymentRequest.getAmount());
                criticalTxn.setStatus("CRITICAL_REFUND_FAILED");
                paymentTransactionRepository.save(criticalTxn);
                // alert admin team
                throw new RuntimeException("Critical: failed to refund after markPaid failure: " + ex.getMessage());
            }
            // after refund, throw original error
            throw new RuntimeException("Failed to mark tuition as paid, refund user: " + e.getMessage());
        }
        // 4) if both ok -> write transaction record
        PaymentTransactionEntity transaction = new PaymentTransactionEntity();
        transaction.setPayerid(paymentRequest.getPayerid());
        transaction.setStudentid(paymentRequest.getStudentid());
        transaction.setAmount(paymentRequest.getAmount());
        transaction.setStatus("SUCCESS");
        paymentTransactionRepository.save(transaction);

        // return response
        PaymentResponse response = new PaymentResponse();
        response.setTransactionId(transaction.getId());
        response.setMessage("SUCCESS");
        response.setAmount(transaction.getAmount());
        return response;
    }
}
