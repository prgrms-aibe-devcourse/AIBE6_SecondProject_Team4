package com.fitmate.review.dto;

public record TrainerRatingResponse(
        Long trainerId,
        double averageRating,
        long reviewCount
) {}