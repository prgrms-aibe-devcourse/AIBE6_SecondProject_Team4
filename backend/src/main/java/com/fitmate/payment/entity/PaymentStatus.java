package com.fitmate.payment.entity;

public enum PaymentStatus {
    READY,     // 결제 생성됨 (주문번호 발급, 결제 대기)
    PAID,      // 결제 완료
    FAILED,    // 결제 실패
    CANCELED   // 결제 취소
}