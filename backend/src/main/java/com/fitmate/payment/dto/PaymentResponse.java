package com.fitmate.payment.dto;

import com.fitmate.payment.entity.Payment;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long lessonRequestId,
        Integer amount,
        String orderId,
        String status,
        String method,
        LocalDateTime paidAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getLessonRequest().getId(),
                payment.getAmount(),
                payment.getOrderId(),
                payment.getStatus().name(),
                payment.getMethod(),
                payment.getPaidAt()
        );
    }
}