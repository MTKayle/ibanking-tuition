package org.example.ibanking.studentservice.repository;

import jakarta.persistence.LockModeType;
import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.entity.TuitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    @Query("SELECT s FROM StudentEntity s " +
            "JOIN FETCH s.tuitionFees tf " +
            "WHERE s.id = :id")
    List<StudentEntity> findAllById(@Param("id") Long id);

}
