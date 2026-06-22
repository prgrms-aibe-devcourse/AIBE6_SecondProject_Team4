package com.fitmate.payment.repository;

import com.fitmate.payment.entity.Payment;
import com.fitmate.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // 주문번호로 결제 조회 (토스 승인 시 검증용)
    Optional<Payment> findByOrderId(String orderId);

    // 레슨 요청에 이미 완료된 결제가 있는지 (중복 결제 방지 / writable 조건)
    boolean existsByLessonRequestIdAndStatus(Long lessonRequestId, com.fitmate.payment.entity.PaymentStatus status);

    // 미완료(READY) 결제 삭제 (재시도 시 중복 생성 방지)
    void deleteByLessonRequestIdAndStatus(Long lessonRequestId, PaymentStatus status);
}