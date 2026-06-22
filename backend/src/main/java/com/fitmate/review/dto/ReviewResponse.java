package com.fitmate.review.dto;

import com.fitmate.review.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long matchingId,
        Long reviewerId,
        String reviewerNickname,
        String reviewerProfileImage,
        Long trainerId,
        Long trainerProfileId,
        String trainerNickname,
        String trainerProfileImage,
        Integer rating,
        String content,
        LocalDateTime createdAt,
        boolean edited
) {
    public static ReviewResponse from(Review review, Long trainerProfileId) {
        boolean edited = review.getUpdatedAt() != null
                && review.getUpdatedAt().isAfter(review.getCreatedAt());

        return new ReviewResponse(
                review.getId(),
                review.getMatchingRequest().getId(),
                review.getReviewer().getId(),
                review.getReviewer().getNickname(),
                review.getReviewer().getProfileImage(),
                review.getTrainer().getId(),
                trainerProfileId,
                review.getTrainer().getNickname(),
                review.getTrainer().getProfileImage(),
                review.getRating(),
                review.getContent(),
                review.getCreatedAt(),
                edited
        );
    }
}