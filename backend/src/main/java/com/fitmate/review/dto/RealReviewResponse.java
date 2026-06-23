package com.fitmate.review.dto;

/**
 * 리얼 후기 (메인 페이지)
 * 별점 높고 내용 있는 대표 후기
 */
public record RealReviewResponse(
        Long id,
        String reviewerNickname,
        String reviewerProfileImage,

        Long trainerProfileId,
        String trainerNickname,
        String sports,

        int rating,
        String content,
        String createdAt
) {
}