package org.example.ibanking.otpservice.client;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Value("${internal.api.token}")
    private String internalToken;

    @Bean
    public RequestInterceptor internalTokenInterceptor() {
        return requestTemplate ->
                requestTemplate.header("X-Internal-Token", internalToken);
    }
}

