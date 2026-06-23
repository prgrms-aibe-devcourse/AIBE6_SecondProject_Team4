package com.fitmate.workout.dto;

public record WorkoutLogRequest(
        String date,
        String routine,
        String diet,
        String memo
) {}