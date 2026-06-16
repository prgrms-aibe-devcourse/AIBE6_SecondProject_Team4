package com.fitmate.trainer.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.trainer.entity.TrainerProfile;

public record TrainerProfileRequest(
        String sports,
        String lessonType,
        Integer price,
        Integer careerYears
) {
    public TrainerProfile toEntity(Member member) {
        return TrainerProfile.builder()
                .member(member)
                .sports(sports)
                .lessonType(lessonType)
                .price(price)
                .careerYears(careerYears)
                .build();
    }
}