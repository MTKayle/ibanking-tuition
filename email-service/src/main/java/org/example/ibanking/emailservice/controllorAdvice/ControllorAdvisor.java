package org.example.ibanking.emailservice.controllorAdvice;

import org.aspectj.apache.bcel.Repository;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ControllorAdvisor {
    // Không gửi được mail
    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<?> handleSendException(MailSendException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Mail Send Failed");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
