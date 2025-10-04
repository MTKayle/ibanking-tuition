package org.example.ibanking.studentservice.repository;

import jakarta.persistence.LockModeType;
import org.example.ibanking.studentservice.entity.StudentEntity;
import org.example.ibanking.studentservice.entity.TuitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TuitionRepository extends JpaRepository<TuitionEntity, Long> {

    @Query("SELECT t FROM TuitionEntity t " +
            "WHERE t.student.id = :studentId AND t.status = :status")
    TuitionEntity findByStudentIdAndStatus(@Param("studentId") Long studentId,
                                           @Param("status") String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TuitionEntity t " +
            "WHERE t.student.id = :studentId AND t.status = :status")
    TuitionEntity findByStudentIdAndStatusForUpdate(@Param("studentId") Long studentId,
                                                    @Param("status") String status);

}
