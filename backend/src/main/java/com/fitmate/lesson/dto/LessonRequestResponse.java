package com.fitmate.lesson.dto;

import com.fitmate.lesson.entity.LessonPassType;
import com.fitmate.lesson.entity.LessonRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record LessonRequestResponse(
        Long lessonRequestId,
        Long matchingResultId,

        Long memberId,
        String memberName,
        String memberProfileImage,
        String memberIntroduction,

        Long trainerProfileId,
        String trainerName,
        String trainerProfileImage,

        String sports,
        String lessonType,
        String lessonLevel,
        String region,
        Integer price,

        LessonPassType lessonPassType,
        Integer packageCount,

        LocalDate requestedDate,
        LocalTime requestedStartTime,
        LocalTime requestedEndTime,
        List<ScheduleResponse> schedules,

        String message,
        LessonRequestStatus status,

        LocalDateTime createdAt
) {
    public record ScheduleResponse(
            Long scheduleId,
            LocalDate requestedDate,
            LocalTime startTime,
            LocalTime endTime
    ) {
    }
}
