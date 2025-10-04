package org.example.ibanking.authservice.controller;

import jakarta.transaction.Transactional;
import org.example.ibanking.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Transactional
@RequestMapping("/ibanking/tuition/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/email/{username}")
    public String getEmailByUsername(@PathVariable String username) {
        System.out.println("da nhan" + username);
        return userService.getEmailByUsername(username);
    }
}
