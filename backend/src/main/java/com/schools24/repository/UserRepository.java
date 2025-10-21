package com.schools24.repository;

import com.schools24.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    long countByRoleAndIsActiveTrue(String role);
    List<User> findTop5ByIsActiveTrueOrderByCreatedAtDesc();
    List<User> findByRoleAndIsActiveTrue(String role);
    Optional<User> findByEmail(String email);
    boolean existsByEmailOrUserId(String email, String userId);
}


