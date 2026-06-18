package com.fitmate.review.dto;

import com.fitmate.review.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long matchingId,
        Long reviewerId,
        String reviewerNickname,
        Long trainerId,
        String trainerNickname,
        Integer rating,
        String content,
        LocalDateTime createdAt,
        boolean edited            // ← 추가
) {
    public static ReviewResponse from(Review review) {
        // updatedAt이 createdAt보다 나중이면 수정된 것
        boolean edited = review.getUpdatedAt() != null
                && review.getUpdatedAt().isAfter(review.getCreatedAt());

        return new ReviewResponse(
                review.getId(),
                review.getMatchingRequest().getId(),
                review.getReviewer().getId(),
                review.getReviewer().getNickname(),
                review.getTrainer().getId(),
                review.getTrainer().getNickname(),
                review.getRating(),
                review.getContent(),
                review.getCreatedAt(),
                edited                // ← 추가
        );
    }
}