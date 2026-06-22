package com.fitmate.auth.repository;

import com.fitmate.auth.entity.SmsVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SmsVerificationRepository extends JpaRepository<SmsVerification, Long> {
    Optional<SmsVerification> findTopByPhoneOrderByIdDesc(String phone);
    void deleteByPhone(String phone);
}