package org.example.ibanking.authservice.service;

import org.example.ibanking.authservice.dto.LoginRequest;
import org.example.ibanking.authservice.dto.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest loginRequest);

}
