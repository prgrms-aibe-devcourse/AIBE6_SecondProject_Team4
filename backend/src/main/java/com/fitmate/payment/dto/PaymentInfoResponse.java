package com.fitmate.payment.dto;

public record PaymentInfoResponse(
        Long lessonRequestId,
        String trainerNickname,    // 트레이너 닉네임
        String sports,             // 운동 종목
        String lessonPassType,     // 1회권/패키지권
        Integer packageCount,      // 패키지 횟수(5·10·20), 1회권은 null
        Integer pricePerSession,   // 세션 단가
        Integer amount,            // 총 결제 금액
        String orderId,            // 주문번호
        String orderName           // 주문명 (토스 결제창 표시용)
) {
}
