package com.fitmate.review.dto;

import com.fitmate.review.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long matchingId,
        Long reviewerId,
        String reviewerNickname,
        Long trainerId,
        int rating,
        String content,
        LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getMatchingRequest().getId(),
                review.getReviewer().getId(),
                review.getReviewer().getNickname(),  // Member에 getNickname()이 있다고 가정
                review.getTrainer().getId(),
                review.getRating(),
                review.getContent(),
                review.getCreatedAt()  // BaseEntity에 createdAt이 있다고 가정
        );
    }
}