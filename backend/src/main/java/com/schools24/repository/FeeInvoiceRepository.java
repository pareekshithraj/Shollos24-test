package com.schools24.repository;

import com.schools24.domain.FeeInvoice;
import com.schools24.domain.School;
import com.schools24.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeInvoiceRepository extends JpaRepository<FeeInvoice, Long> {
    List<FeeInvoice> findBySchool(School school);
    List<FeeInvoice> findByStudent(User student);
}


