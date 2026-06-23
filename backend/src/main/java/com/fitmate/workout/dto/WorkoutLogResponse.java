package com.fitmate.workout.dto;

import com.fitmate.workout.entity.WorkoutLog;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WorkoutLogResponse(
        Long id,
        Long matchingId,
        LocalDate date,
        String routine,
        String diet,
        String memo,
        List<String> memberPhotos,
        boolean completed,
        String trainerNickname,
        String trainerComment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static WorkoutLogResponse from(WorkoutLog log, List<String> memberPhotos) {
        return new WorkoutLogResponse(
                log.getId(),
                log.getMatchingResult().getId(),
                log.getDate(),
                log.getRoutine(),
                log.getDiet(),
                log.getMemo(),
                memberPhotos,
                log.isCompleted(),
                log.getTrainer().getNickname(),
                log.getTrainerComment(),
                log.getCreatedAt(),
                log.getUpdatedAt()
        );
    }
}