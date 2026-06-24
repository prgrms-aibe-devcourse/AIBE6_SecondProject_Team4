package com.fitmate.lesson.dto;

import com.fitmate.lesson.entity.LessonPassType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record LessonRequestCreateRequest(
        Long matchingResultId,

        Long trainerProfileId,

        @NotNull LessonPassType lessonPassType,

        Integer packageCount,

        @NotBlank String selectedSports,

        @NotBlank String selectedLessonLevel,

        @NotBlank String selectedLessonType,

        String selectedRegion,

        @NotNull LocalDate requestedDate,

        @NotNull LocalTime requestedStartTime,

        @NotNull LocalTime requestedEndTime,

        @NotEmpty @Valid List<ScheduleRequest> schedules,

        String message
) {
    public record ScheduleRequest(
            @NotNull LocalDate requestedDate,
            @NotNull LocalTime startTime,
            @NotNull LocalTime endTime
    ) {
    }
}
