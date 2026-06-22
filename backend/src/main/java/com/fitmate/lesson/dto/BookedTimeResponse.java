package com.fitmate.lesson.dto;

import java.time.LocalTime;

public record BookedTimeResponse(
        LocalTime startTime,
        LocalTime endTime
) {
}