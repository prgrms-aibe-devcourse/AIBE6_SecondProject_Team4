package com.fitmate.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sms_verifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SmsVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;
    private String code;
    private boolean verified;
    private LocalDateTime expiresAt;

    @Builder
    public SmsVerification(String phone, String code, LocalDateTime expiresAt) {
        this.phone = phone;
        this.code = code;
        this.verified = false;
        this.expiresAt = expiresAt;
    }

    public void verify() {
        this.verified = true;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}