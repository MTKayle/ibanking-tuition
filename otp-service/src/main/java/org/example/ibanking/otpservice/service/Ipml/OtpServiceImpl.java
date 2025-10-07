package org.example.ibanking.otpservice.service.Ipml;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.ibanking.otpservice.client.EmailClient;
import org.example.ibanking.otpservice.client.dto.EmailReponse;
import org.example.ibanking.otpservice.client.dto.EmailRequestOTP;
import org.example.ibanking.otpservice.dto.OtpReponse;
import org.example.ibanking.otpservice.dto.OtpRequest;
import org.example.ibanking.otpservice.dto.VerifyOtpReponse;
import org.example.ibanking.otpservice.dto.VerifyOtpRequest;
import org.example.ibanking.otpservice.entity.OtpEntity;
import org.example.ibanking.otpservice.reponsitory.OtpReponsitory;
import org.example.ibanking.otpservice.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpReponsitory otpReponsitory;

    @Autowired
    private EmailClient emailClient;
    // Save OTP to database
    public  void saveOtp(Long tuitionId, String otp, UUID userId) {
        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setTuitionId(tuitionId);
        System.out.println(otpEntity.getTuitionId());
        otpEntity.setUsed(false);
        otpEntity.setUserId(userId); // giả sử userId là UUID ngẫu nhiên
        otpEntity.setCodeHash(otp); // mã hóa otp
        otpEntity.setCreatedAt(LocalDateTime.now());
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // hết hạn sau 1 phút
        otpReponsitory.save(otpEntity);
    }

    // Đánh dấu tất cả OTP cũ của cùng tuitionId là "đã dùng"
    @Transactional
    public void invalidateOldOtp(Long tuitionId, UUID userId) {
        List<OtpEntity> oldOtp = otpReponsitory.findByTuitionIdAndUserId(tuitionId, userId);
        for (OtpEntity otp : oldOtp) {
            if (!otp.isUsed()) {
                otp.setUsed(true);
                otpReponsitory.save(otp);
            }
        }
    }

    @Override
    // Send OTP
    public OtpReponse sendOtp(OtpRequest otpRequest) {

        EmailReponse emailReponse = new EmailReponse();
        EmailRequestOTP emailRequestOTP = new EmailRequestOTP();

        // 1️ Vô hiệu hóa OTP cũ
        invalidateOldOtp(otpRequest.getTuitionId(), otpRequest.getUserId());

        // 2️ Tạo OTP mới
        String toEmail = otpRequest.getToEmail();
        String otp = String.format("%06d", new Random().nextInt(999999));

        // 3️ Gửi qua email
        emailRequestOTP.setToEmail(toEmail);
        emailRequestOTP.setOtp(otp);
        emailReponse = emailClient.sendOtp(emailRequestOTP);

        // 4️ Lưu vào DB
        saveOtp(otpRequest.getTuitionId(), otp, otpRequest.getUserId());

        // 5 Phản hồi
        OtpReponse otpReponse = new OtpReponse();
        otpReponse.setSuccess(emailReponse.isSuccess());
        return otpReponse;
    }


    @Override
    // Verify OTP
    public VerifyOtpReponse verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        System.out.println("verifyOtp111111111");
        VerifyOtpReponse verifyOtpReponse = new VerifyOtpReponse();
        System.out.println(verifyOtpRequest.getTuitionId());
        List<OtpEntity> listOtpEntity = otpReponsitory.findByTuitionIdAndUserId(verifyOtpRequest.getTuitionId(), verifyOtpRequest.getUserId());

        // kiểm tra không có otp nào
        if (listOtpEntity.isEmpty()) {
            verifyOtpReponse.setSuccess(false);
            verifyOtpReponse.setMessage("Không tồn tại OTP cho mã giao dịch này");
            return verifyOtpReponse;
        }

        for (OtpEntity otpEntity : listOtpEntity) {
            boolean verify = true;

            if (!otpEntity.getCodeHash().equals(verifyOtpRequest.getOtp())) {
                verify = false; // OTP không đúng
            }
            if (otpEntity.isUsed()) {
                verify = false; // OTP đã được sử dụng
            }
            if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
                verify = false; // OTP đã hết hạn
            }
            if (!otpEntity.getUserId().equals(verifyOtpRequest.getUserId())) {
                verify = false; // OTP không thuộc về user này
            }

            if (verify) {
                // OTP hợp lệ → đánh dấu đã dùng
                otpEntity.setUsed(true);
                otpReponsitory.save(otpEntity);

                verifyOtpReponse.setSuccess(true);
                verifyOtpReponse.setMessage("Xác thực OTP thành công");
                return verifyOtpReponse;
            }
        }

        // nếu không OTP nào hợp lệ
        verifyOtpReponse.setSuccess(false);
        verifyOtpReponse.setMessage("OTP không hợp lệ hoặc đã hết hạn");
        return verifyOtpReponse;
    }
}
