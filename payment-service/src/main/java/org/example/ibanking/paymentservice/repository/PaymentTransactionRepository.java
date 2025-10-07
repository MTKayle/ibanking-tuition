package org.example.ibanking.paymentservice.repository;

import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, UUID> {
    List<PaymentTransactionEntity> findByPayeridOrderByCreatedAtDesc(UUID payerid);
}
