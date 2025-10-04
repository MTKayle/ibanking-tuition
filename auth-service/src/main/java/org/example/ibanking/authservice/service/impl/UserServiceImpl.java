package org.example.ibanking.authservice.service.impl;

import org.example.ibanking.authservice.entity.UserEntity;
import org.example.ibanking.authservice.repository.UserRepository;
import org.example.ibanking.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public String getEmailByUsername(String username) {
        // Dummy implementation for example purposes
        UserEntity user = userRepository.findByUsername(username);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        return user.getEmail();
    }
}
