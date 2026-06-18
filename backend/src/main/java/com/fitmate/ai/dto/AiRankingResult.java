package com.fitmate.ai.dto;

public record AiRankingResult(
        Long trainerProfileId,
        Integer rank,
        String reason
) {
}