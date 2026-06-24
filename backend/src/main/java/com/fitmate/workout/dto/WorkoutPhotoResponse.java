package com.fitmate.workout.dto;

import com.fitmate.workout.entity.WorkoutPhoto;

public record WorkoutPhotoResponse(
        Long id,
        String photoUrl
) {
    public static WorkoutPhotoResponse from(WorkoutPhoto photo) {
        return new WorkoutPhotoResponse(photo.getId(), photo.getPhotoUrl());
    }
}