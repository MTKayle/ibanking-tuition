package org.example.ibanking.authservice.service.impl;

import org.example.ibanking.authservice.dto.LoginRequest;
import org.example.ibanking.authservice.dto.LoginResponse;
import org.example.ibanking.authservice.entity.UserEntity;
import org.example.ibanking.authservice.repository.UserRepository;
import org.example.ibanking.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public LoginResponse authenticate(LoginRequest loginRequest) {
        // Implement your authentication logic here
        UserEntity userEntity = userRepository.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());
        LoginResponse loginResponse = new LoginResponse();
        if (userEntity != null) {
            loginResponse.setEmail(userEntity.getEmail());
            loginResponse.setBalance(userEntity.getBalance());
            loginResponse.setFullName(userEntity.getFullname());
            loginResponse.setPhoneNumber(userEntity.getPhonenumber());
        }else {
            throw new RuntimeException("Invalid credentials");
        }
        return loginResponse;
    }
}
