package com.fitmate.lesson.dto;

import com.fitmate.lesson.entity.LessonPassType;
import com.fitmate.lesson.entity.LessonRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record LessonRequestResponse(
        Long lessonRequestId,
        Long matchingResultId,

        Long memberId,
        String memberName,
        String memberProfileImage,

        Long trainerProfileId,
        String trainerName,
        String trainerProfileImage,

        String sports,
        String lessonType,
        String region,
        Integer price,

        LessonPassType lessonPassType,
        Integer weeklyCount,

        LocalDate requestedDate,
        LocalTime requestedStartTime,
        LocalTime requestedEndTime,

        String message,
        LessonRequestStatus status,

        LocalDateTime createdAt
) {
}