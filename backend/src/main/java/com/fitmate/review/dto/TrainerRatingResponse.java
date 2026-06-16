package com.fitmate.review.dto;

import java.util.Map;

public record TrainerRatingResponse(
        Long trainerId,
        double averageRating,
        long reviewCount,
        Map<Integer, Long> ratingDistribution  // 추가: {5:10, 4:3, 3:1, 2:0, 1:0}
) {}