package com.schools24.repository;

import com.schools24.domain.FeeInvoice;
import com.schools24.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByInvoice(FeeInvoice invoice);
}


