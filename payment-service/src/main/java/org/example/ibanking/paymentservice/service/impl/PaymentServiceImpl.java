package org.example.ibanking.paymentservice.service.impl;

import org.example.ibanking.paymentservice.client.EmailClient;
import org.example.ibanking.paymentservice.client.OtpClient;
import org.example.ibanking.paymentservice.client.StudentClient;
import org.example.ibanking.paymentservice.client.UserClient;
import org.example.ibanking.paymentservice.dto.*;
import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;
//import org.example.ibanking.paymentservice.kafka.PaymentProducer;
import org.example.ibanking.paymentservice.repository.PaymentTransactionRepository;
import org.example.ibanking.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private OtpClient otpClient;

    @Autowired
    private EmailClient emailClient;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

//    @Autowired
//    private PaymentProducer paymentProducer;

    /**
     * Orchestrates saga:
     * 1) deduct on user
     * 2) mark student as paid
     * 3) if step2 fails -> refund user
     * 4) if both ok -> write transaction record
     */


    public PaymentResponse payTuition(PaymentRequest paymentRequest) {
        // verify otp
        VerifyOtpRequest verifyOtpRequest = new VerifyOtpRequest();
        verifyOtpRequest.setOtp(paymentRequest.getOtp());
        verifyOtpRequest.setUserId(paymentRequest.getPayerid());
        verifyOtpRequest.setTuitionId(paymentRequest.getTuitionid());

        boolean isOtpValid = verifyOtp(verifyOtpRequest);
        if (!isOtpValid) {
            throw new RuntimeException("Invalid OTP");
        }

//        try {
//            // send to kafka and wait for response
//            PaymentResponse paymentResponse = paymentProducer.sendAndWait(paymentRequest);
//            return paymentResponse;
//        } catch (Exception e) {
//            throw new RuntimeException("Payment processing failed via Kafka", e);
//        }




        // check tuition status first
        try{
            studentClient.status(paymentRequest.getTuitionid());
        } catch (Exception e) {
            throw new RuntimeException("Tuition is already paid: " + e.getMessage());
        }


        //1) deduct on user
        //  2) mark student as paid
        // deduct balance (transactional in user service)
        try {
            userClient.deduct(paymentRequest.getPayerid(), paymentRequest.getAmount());
        } catch (Exception e) {
            // Deduct fail -> ghi transaction FAILED
            PaymentTransactionEntity failTxn = new PaymentTransactionEntity();
            failTxn.setPayerid(paymentRequest.getPayerid());
            failTxn.setStudentid(paymentRequest.getStudentid());
            failTxn.setAmount(paymentRequest.getAmount());
            failTxn.setStatus("FAILED_DEDUCT");
            paymentTransactionRepository.save(failTxn);

            // set tuition back to UNPAID if it was changed to PENDING
            studentClient.setUnpaid(paymentRequest.getTuitionid());
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

                // set tuition back to UNPAID if it was changed to PENDING
                studentClient.setUnpaid(paymentRequest.getTuitionid());
            } catch (Exception ex) {
        // log error

        // refund cũng fail -> ghi trạng thái đặc biệt
                PaymentTransactionEntity criticalTxn = new PaymentTransactionEntity();
                criticalTxn.setPayerid(paymentRequest.getPayerid());
                criticalTxn.setStudentid(paymentRequest.getStudentid());
                criticalTxn.setAmount(paymentRequest.getAmount());
                criticalTxn.setStatus("CRITICAL_REFUND_FAILED");
                paymentTransactionRepository.save(criticalTxn);

                // set tuition back to UNPAID if it was changed to PENDING
                studentClient.setUnpaid(paymentRequest.getTuitionid());
        // alert admin team
                throw new RuntimeException("Critical: failed to refund after markPaid failure: " + ex.getMessage());
            }
        // after refund, throw original error
            // set tuition back to UNPAID if it was changed to PENDING
            studentClient.setUnpaid(paymentRequest.getTuitionid());
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

        // call email service to send bill
        // call auth service to get email by username
        ResponseEntity<String> toEmail = userClient.getEmailById(paymentRequest.getPayerid());
        // call student service to get student entity
        ResponseEntity<StudentResponse> studentResponse = studentClient.getStudentEntityById(paymentRequest.getStudentid());

        StudentResponse student = studentResponse.getBody();

        EmailRequestPayment emailRequest = new EmailRequestPayment();

        emailRequest.setToEmail(toEmail.getBody());
        emailRequest.setStudentId(paymentRequest.getStudentid());
        emailRequest.setNameStudent(student.getFullname());
        emailRequest.setMajor(student.getMajor());
        //set date time now
        emailRequest.setDateTime(LocalDateTime.now());
        emailClient.sendEmailPayment(emailRequest);

        return response;
    }

    public boolean sendOtp (OtpRequest otpRequest){
        // Dummy implementation for sending OTP
        ResponseEntity<?> response = otpClient.sendOtp(otpRequest);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to send OTP");
        }

        return true;
    }

    public boolean verifyOtp (VerifyOtpRequest verifyOtpRequest){
        // Dummy implementation for sending OTP
        ResponseEntity<VerifyOtpResponse> response = otpClient.verifyOtp(verifyOtpRequest);
        if (!response.getBody().isSuccess()) {
            throw new RuntimeException("Failed to verify OTP");
        }
        return true;
    }

    @Override
    public List<PaymentTransactionEntity> getPaymentHistory(UUID payerid) {
        return paymentTransactionRepository.findByPayeridOrderByCreatedAtDesc(payerid);
    }
}

