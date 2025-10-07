package org.example.ibanking.paymentservice.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(0) // Ensure this filter runs before other filters
public class GatewaySecretFilter extends OncePerRequestFilter {

    // Header name and expected secret value
    private static final String HEADER = "X-Gateway-Secret";
    private static final String SECRET = "my-super-secret";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {


        String path = request.getRequestURI();
        // Bỏ qua check secret nếu là internal
        if (path.contains("/internal/")) {
            filterChain.doFilter(request, response);
            return;
        }
        // Check request from API Gateway
        String secret = request.getHeader(HEADER);
        System.out.println("secret api:" + secret);

        if (!SECRET.equals(secret)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
            return;
        }

        filterChain.doFilter(request, response);
    }
}



