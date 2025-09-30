package org.example.ibanking.emailservice;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
public class TestMail {

    @Autowired
    private JavaMailSender javaMailSender;

    @Test
    public void testSendEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("your-email@gmail.com"); // đổi thành email của bạn
        msg.setSubject("Test Mail");
        msg.setText("Hello world from test!");

        javaMailSender.send(msg);
        System.out.println("Mail sent!");
    }
}
