package org.example.ibanking.authservice.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// Cấu hình để kiểm tra mã hóa mật khẩu lưu trữ trong database để test
// Chạy ứng dụng sẽ in ra hash của mật khẩu "123456"
@Configuration
public class HasingPasswordTestConfig {
    @Bean
    CommandLineRunner run(PasswordEncoder passwordEncoder) {
        return args -> {
            String raw = "123456";
            String hash = passwordEncoder.encode(raw);
            System.out.println("Hash for " + raw + " = " + hash);
        };
    }
}
