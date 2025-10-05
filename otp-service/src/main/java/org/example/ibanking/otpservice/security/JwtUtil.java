package org.example.ibanking.otpservice.security;


import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import java.security.Key;
import java.util.Date;


//generate and extract token
@Component
public class JwtUtil {
    //dung tam, nen dung bien moi truong de luu secret key va expiration time
    private final String SECRET_KEY  = "mySuperSecretKeyForJwtAuth1234567890";
    private final long expirationTime = 1000 * 60 * 60; // 1 hour

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate a JWT token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Set the subject (username)
                .setIssuedAt(new Date()) // Set the issue time
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Set the expiration time
                .signWith(getKey(), SignatureAlgorithm.HS256) // Sign the token with the secret key
                .compact(); // Build the token (header.payload.signature)
    }

    // Extract username from the JWT token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey()) // Set the signing key
                .build()
                .parseClaimsJws(token) // Parse the token
                .getBody() // Get the body (claims)
                .getSubject(); // Extract the subject (username)
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getKey()) // Set the signing key
                    .build()
                    .parseClaimsJws(token); // Parse the token
            return true; // Token is valid
        } catch (JwtException e) {
            //Token is invalid (expired, malformed, etc.)

            return false;
        }
    }
}
