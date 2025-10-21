package com.schools24.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fee_heads")
public class FeeHead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., Tuition, Transport

    private Integer amount; // default amount in smallest currency unit

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;
}


