package com.fitmate.payment.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.lesson.entity.LessonRequest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Payment extends BaseEntity {

    // 어떤 레슨 요청에 대한 결제인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_request_id", nullable = false)
    private LessonRequest lessonRequest;

    // 결제 금액 (레슨 요청 정보로 계산)
    @Column(nullable = false)
    private Integer amount;

    // 주문 번호 (우리가 생성, 토스에 넘김) — 고유
    @Column(name = "order_id", nullable = false, unique = true, length = 100)
    private String orderId;

    // 토스가 주는 결제 키 (승인 성공 후 저장)
    @Column(name = "payment_key", length = 200)
    private String paymentKey;

    // 결제 수단 (카드/간편결제 등, 토스 응답)
    @Column(length = 50)
    private String method;

    // 결제 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status;

    // 결제 완료 시각
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // ── 상태 변경 메서드 ──
    public void complete(String paymentKey, String method) {
        this.paymentKey = paymentKey;
        this.method = method;
        this.status = PaymentStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = PaymentStatus.FAILED;
    }

    public void cancel() {
        this.status = PaymentStatus.CANCELED;
    }
}