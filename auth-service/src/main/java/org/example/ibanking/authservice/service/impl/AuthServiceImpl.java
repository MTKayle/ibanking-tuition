package org.example.ibanking.authservice.service.impl;

import org.example.ibanking.authservice.dto.LoginRequest;
import org.example.ibanking.authservice.dto.LoginResponse;
import org.example.ibanking.authservice.entity.UserEntity;
import org.example.ibanking.authservice.repository.UserRepository;
import org.example.ibanking.authservice.security.JwtUtil;
import org.example.ibanking.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Implementation of AuthService to handle user authentication
@Service
public class AuthServiceImpl implements AuthService {

    // Inject UserRepository to access user data
    @Autowired
    private UserRepository userRepository;

    // Inject JwtUtil to generate JWT tokens
    @Autowired
    private JwtUtil jwtUtil;


    // Inject PasswordEncoder to handle password hashing and verification
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse authenticate(LoginRequest loginRequest) {
        // Implement your authentication logic here
        UserEntity userEntity = userRepository.findByUsername(loginRequest.getUsername());
        if(userEntity == null){
            throw new RuntimeException("User not found");
        }
        // compare password
        if(!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }
        // Generate JWT token
        LoginResponse user = new LoginResponse();

        String token = jwtUtil.generateToken(userEntity.getUsername());
        // set user details
        user.setFullName(userEntity.getFullname());
        user.setToken(token);
        user.setEmail(userEntity.getEmail());
        user.setPhoneNumber(userEntity.getPhonenumber());
        user.setBalance(userEntity.getBalance());

        return user;
    }
}
