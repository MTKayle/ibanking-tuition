package org.example.ibanking.emailservice.service.impl;
import org.example.ibanking.emailservice.dto.EmailRequestOTP;
import org.example.ibanking.emailservice.dto.EmailRequestPayment;
import org.example.ibanking.emailservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {


    @Autowired
    private JavaMailSender javaMailSender;

    private static final String paymentMessage(String StudentID, String nameStudent, String major, LocalDateTime dateTime) {
        String formattedDate = dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        return String.format(
                "Kính gửi Khách hàng,\n\n" +
                        "Mail thông báo bạn đã hoàn tất thanh toán học phí thành công với thông tin sau:\n\n" +
                        "- Mã số sinh viên: %s\n" +
                        "- Họ và tên: %s\n" +
                        "- Học kỳ: %s\n" +
                        "- Thời gian thanh toán: %s\n\n" +
                        "Trân trọng,\n",
                StudentID, nameStudent, major, formattedDate
        );
    }

    private static final String otpMessage(String otp) {
        return String.format(
                "Kính gửi Khách hàng,\n\n" +
                        "Bạn vừa yêu cầu xác thực giao dịch/đăng nhập trên hệ thống iBanking.\n" +
                        "Vui lòng sử dụng mã OTP sau để hoàn tất quá trình xác thực:\n\n" +
                        "👉 Mã OTP của bạn: %s\n\n" +
                        "⚠️ Lưu ý:\n" +
                        "- Mã OTP chỉ có hiệu lực trong vòng 1 phút.\n" +
                        "- Không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn tài khoản.\n\n" +
                        "Trân trọng,\n",
                otp
        );
    }


    public boolean sendEmailPayment(EmailRequestPayment emailRequestPayment) {

        String paymentMessage = paymentMessage(
                emailRequestPayment.getStudentId(),
                emailRequestPayment.getNameStudent(),
                emailRequestPayment.getMajor(),
                emailRequestPayment.getDateTime()
        );


        SimpleMailMessage message = new SimpleMailMessage();
        try{
            message.setTo(emailRequestPayment.getToEmail());
            message.setText(paymentMessage);
            message.setSubject("THÔNG BÁO THANH TOÁN HỌC PHÍ THÀNH CÔNG");
            javaMailSender.send(message);
            return true;
        }
        catch (Exception e){
            throw new MailSendException(e.getMessage());
        }
    }

    public boolean sendEmailOTP(EmailRequestOTP emailRequestOTP) {

        String otpMessage = otpMessage(emailRequestOTP.getOtp());

        SimpleMailMessage message = new SimpleMailMessage();
        try{
            message.setTo(emailRequestOTP.getToEmail());
            message.setText(otpMessage);
            message.setSubject("MÃ OTP XÁC THỰC GIAO DỊCH");
            javaMailSender.send(message);
            return true;
        }
        catch (Exception e){
            throw new MailSendException(e.getMessage());
        }
    }
}
