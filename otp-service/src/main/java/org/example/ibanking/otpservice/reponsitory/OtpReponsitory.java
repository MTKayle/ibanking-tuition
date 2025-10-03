package org.example.ibanking.otpservice.reponsitory;

import org.example.ibanking.otpservice.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OtpReponsitory extends JpaRepository<OtpEntity, UUID> {
}
