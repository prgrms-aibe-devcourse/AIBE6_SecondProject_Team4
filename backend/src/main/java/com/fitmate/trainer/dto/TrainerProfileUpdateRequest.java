package com.fitmate.trainer.dto;

import java.time.LocalTime;
import java.util.List;

public record TrainerProfileUpdateRequest(
        String sports,
        String lessonType,
        String lessonLevel,
        Integer price,
        Integer careerYears,
        Integer lessonDurationMinutes,
        List<AvailableTimeRequest> availableTimes,
        List<String> lessonPhotoUrls,
        Boolean isPublic
) {
    public record AvailableTimeRequest(
            Long id,
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
    }
}