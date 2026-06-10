package com.fitmate.trainer.dto;

import com.fitmate.trainer.entity.TrainerProfile;

public record TrainerProfileResponse(
        Long id,
        Long memberId,
        String sports,
        String lessonType,
        Integer price
) {
    public static TrainerProfileResponse from(TrainerProfile profile) {
        return new TrainerProfileResponse(
                profile.getId(),
                profile.getMember().getId(),
                profile.getSports(),
                profile.getLessonType(),
                profile.getPrice()
        );
    }
}
