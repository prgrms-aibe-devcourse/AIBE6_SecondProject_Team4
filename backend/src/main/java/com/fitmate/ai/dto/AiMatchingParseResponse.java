package com.fitmate.ai.dto;

import java.time.LocalTime;
import java.util.List;

public record AiMatchingParseResponse(
        String sports,
        String level,
        String lessonType,
        String region,
        Integer budgetMin,
        Integer budgetMax,
        List<PreferredTime> preferredTimes,
        String lessonContent
) {
    public record PreferredTime(
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
    }
}