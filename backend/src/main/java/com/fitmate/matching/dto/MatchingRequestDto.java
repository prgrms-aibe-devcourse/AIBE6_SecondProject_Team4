package com.fitmate.matching.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalTime;
import java.util.List;

public record MatchingRequestDto(
        @NotBlank String level,
        @NotBlank String sports,
        @NotBlank String lessonType,
        @NotBlank String region,

        @NotNull @Positive Integer budgetMin,
        @NotNull @Positive Integer budgetMax,

        String lessonContent,

        @NotEmpty @Valid List<PreferredTimeDto> preferredTimes
) {
    public record PreferredTimeDto(
            @NotBlank String dayOfWeek,
            @NotNull LocalTime startTime,
            @NotNull LocalTime endTime

    ) {
    }
}
