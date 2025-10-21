package com.schools24.repository;

import com.schools24.domain.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    long countByIsActiveTrue();
    Optional<SchoolClass> findByNameAndGradeAndSectionAndIsActiveTrue(String name, String grade, String section);
}


