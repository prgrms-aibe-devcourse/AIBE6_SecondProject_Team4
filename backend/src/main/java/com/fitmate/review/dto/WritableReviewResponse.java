package com.fitmate.review.dto;

import java.time.LocalDate;

/**
 * 작성 가능한 후기 대상 (매칭 성사 후 미작성 트레이너)
 *
 * 사용자가 보낸 레슨 요청 중 ACCEPTED 상태이고,
 * 아직 후기를 작성하지 않은 트레이너 정보를 담는다.
 */
public record WritableReviewResponse(
        Long lessonRequestId,   // 레슨 요청 id
        Long matchingId,        // 후기 작성 시 사용할 matching_id
        Long trainerId,         // 후기 작성 시 사용할 trainer(Member) id
        String trainerNickname, // 트레이너 닉네임
        String sports,          // 종목
        LocalDate lessonDate    // 수업 날짜 (요청 날짜)
) {
}