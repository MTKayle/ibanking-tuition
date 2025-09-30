package org.example.ibanking.authservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1) // Ensure this filter runs after GatewaySecretFilter
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // This method filters incoming HTTP requests to validate JWT tokens.
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException{
        // Extract the Authorization header from the request
        String authHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        // Check if the Authorization header is present and starts with "Bearer "
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            // Extract the token from the header (removing "Bearer " prefix)
            token = authHeader.substring(7);
            try {
                // Extract the username from the token
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // exception handling for token parsing issues (e.g., expired or malformed token)
                throw new RuntimeException(e);
            }
        }

        // If a username was extracted and no authentication is currently set in the context
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            if(jwtUtil.validateToken(token)){
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, null);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
