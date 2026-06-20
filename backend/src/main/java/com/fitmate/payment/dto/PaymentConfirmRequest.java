package com.fitmate.payment.dto;

public record PaymentConfirmRequest(
        String paymentKey,   // 토스가 발급한 결제 키
        String orderId,      // 주문번호
        Integer amount       // 결제 금액 (검증용)
) {
}