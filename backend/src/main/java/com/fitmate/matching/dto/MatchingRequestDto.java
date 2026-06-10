package com.fitmate.matching.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MatchingRequestDto(
        @NotBlank String level,
        @NotBlank String sports,
        @NotBlank String lessonType,
        @NotBlank String region,
        @NotNull @Positive Integer budgetMin,
        @NotNull @Positive Integer budgetMax
) {}
