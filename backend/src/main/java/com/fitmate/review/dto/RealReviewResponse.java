package com.fitmate.review.dto;

/**
 * 리얼 후기 (메인 페이지)
 * 별점 높고 내용 있는 대표 후기
 */
public record RealReviewResponse(
        Long id,
        String reviewerNickname, // 작성자 닉네임
        String reviewerProfileImage,
        String trainerNickname,  // 트레이너 닉네임
        int rating,
        String content,
        String createdAt
) {
}