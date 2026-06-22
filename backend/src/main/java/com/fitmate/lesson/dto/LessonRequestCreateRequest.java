package com.fitmate.lesson.dto;

import com.fitmate.lesson.entity.LessonPassType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record LessonRequestCreateRequest(
        Long matchingResultId,

        Long trainerProfileId,

        @NotNull LessonPassType lessonPassType,

        Integer weeklyCount,

        @NotNull LocalDate requestedDate,

        @NotNull LocalTime requestedStartTime,

        @NotNull LocalTime requestedEndTime,

        String message,

        String selectedSport,

        String selectedLessonType,
        
        String selectedLessonLevel
) {
}