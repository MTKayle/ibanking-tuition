package org.example.ibanking.apigateway.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;

import javax.crypto.spec.SecretKeySpec;

// Cấu hình JwtDecoder để xác thực JWT trong API Gateway
@Configuration
public class JwtDecoderConfig {

    //dung secret key này để mã hóa và giải mã JWT
    private static final String SECRET_KEY = "mySecretKey123OnlyUseInDevSmallProject"; // key

    @Bean
    public NimbusReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder
                .withSecretKey(new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256"))
                .build();
    }
}

