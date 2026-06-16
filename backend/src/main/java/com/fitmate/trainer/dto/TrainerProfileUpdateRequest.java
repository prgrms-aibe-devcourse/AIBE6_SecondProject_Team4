package com.fitmate.trainer.dto;

public record TrainerProfileUpdateRequest(
        String sports,
        String lessonType,
        Integer price,
        Integer careerYears
) {
}