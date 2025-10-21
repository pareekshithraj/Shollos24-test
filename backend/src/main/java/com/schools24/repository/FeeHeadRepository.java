package com.schools24.repository;

import com.schools24.domain.FeeHead;
import com.schools24.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeHeadRepository extends JpaRepository<FeeHead, Long> {
    List<FeeHead> findBySchool(School school);
}


