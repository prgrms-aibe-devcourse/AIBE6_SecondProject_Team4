package com.fitmate.trainer.dto;

import java.time.LocalTime;
import java.util.List;

public record TrainerProfileUpdateRequest(
        String sports,
        String lessonType,
        String lessonLevel,
        Integer price,
        Integer careerYears,
        List<AvailableTimeRequest> availableTimes
) {
    public record AvailableTimeRequest(
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {}
}