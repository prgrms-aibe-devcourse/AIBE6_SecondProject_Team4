package com.fitmate.payment.dto;

import com.fitmate.lesson.entity.LessonRequest;

public record PaymentInfoResponse(
        Long lessonRequestId,
        String trainerNickname,    // 트레이너 닉네임
        String sports,             // 운동 종목
        String lessonPassType,     // 단발/정기
        Integer weeklyCount,       // 주당 횟수
        Integer pricePerSession,   // 세션 단가
        Integer amount,            // 총 결제 금액
        String orderId,            // 주문번호
        String orderName           // 주문명 (토스 결제창 표시용)
) {
}