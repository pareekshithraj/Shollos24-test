package com.schools24.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id")
    private FeeInvoice invoice;

    private Integer amount;
    private String method; // CASH, CARD, UPI
    private Instant paidAt = Instant.now();
}


