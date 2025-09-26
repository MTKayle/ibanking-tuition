package org.example.ibanking.authservice.repository;

import org.example.ibanking.authservice.dto.LoginResponse;
import org.example.ibanking.authservice.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    UserEntity findByUsername(String username);
    UserEntity findByUsernameAndPassword(String username, String password);
}
