package com.fitmate.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
        @NotNull Long matchingId,
        @Min(1) @Max(5) int rating,
        @NotBlank String content
) {}
