package com.fitmate.matching.dto;

import java.time.LocalTime;

public record MatchingResultResponse(
        Long matchingResultId,
        Long trainerProfileId,
        String trainerName,
        String profileImage,
        String introduction,
        String sports,
        String lessonType,
        String lessonLevel,
        String region,
        Integer price,
        String dayOfWeek,
        LocalTime preferredStartTime,
        LocalTime preferredEndTime,
        LocalTime trainerStartTime,
        LocalTime trainerEndTime
) {
}