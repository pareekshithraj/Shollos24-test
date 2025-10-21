package com.schools24.repository;

import com.schools24.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    long countByIsActiveTrue();
    boolean existsByCode(String code);
}


