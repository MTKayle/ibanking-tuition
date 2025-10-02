package org.example.ibanking.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

// Cấu hình bảo mật cho API Gateway
// Cho phép truy cập không cần xác thực đến các endpoint đăng nhập
@Configuration
@Order(0)
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/ibanking/tuition/auth/**").permitAll()   // cho phép login
                        .anyExchange().authenticated()          // còn lại bắt buộc JWT
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));

        return http.build();
        
    }
}
