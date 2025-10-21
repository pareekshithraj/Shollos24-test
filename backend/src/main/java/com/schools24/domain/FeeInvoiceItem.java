package com.schools24.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fee_invoice_items")
public class FeeInvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id")
    private FeeInvoice invoice;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fee_head_id")
    private FeeHead head;

    private Integer amount;
}


