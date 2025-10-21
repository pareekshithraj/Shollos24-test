package com.schools24.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "fee_invoices")
public class FeeInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "school_id")
    private School school;

    private Integer totalAmount = 0;
    private Integer paidAmount = 0;
    private String status = "UNPAID"; // UNPAID, PARTIAL, PAID
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeeInvoiceItem> items = new ArrayList<>();
}


