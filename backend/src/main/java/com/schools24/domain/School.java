package com.schools24.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "schools")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String domain;

    private String email;

    private String address;
    private String city;
    private String state;
    private String country;

    private Boolean lockTeacherCreation = false;
    private Boolean lockStudentCreation = false;

    private Instant createdAt = Instant.now();
}


