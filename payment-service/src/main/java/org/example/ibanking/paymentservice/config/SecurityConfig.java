package org.example.ibanking.paymentservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

// Cấu hình bảo mật cho Auth Service
// Cho phép truy cập không cần xác thực đến các endpoint đăng nhập
// Các endpoint khác yêu cầu xác thực JWT
@Configuration
public class SecurityConfig {

//    @Autowired
//    private JwtAuthFilter jwtAuthFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Cho phép tất cả request không cần xác thực
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .addFilterBefore(gatewaySecretFilter, UsernamePasswordAuthenticationFilter.class) // check x-secret header để đam bảo request từ API Gateway
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // check JWT
                .build(); //
    }

    // Bean để mã hóa mật khẩu sử dụng thuật toán BCrypt
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
}
