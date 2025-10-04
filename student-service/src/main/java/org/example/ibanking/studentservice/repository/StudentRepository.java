package org.example.ibanking.studentservice.repository;

import org.example.ibanking.studentservice.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {

    @Query("SELECT DISTINCT s FROM StudentEntity s " +
            "JOIN FETCH s.tuitionFees tf " +
            "WHERE s.id = :id AND tf.status = :status")
    StudentEntity findByIdAndStatus(@Param("id") Long id, @Param("status") String status);
}
