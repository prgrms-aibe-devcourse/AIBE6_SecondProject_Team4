package com.fitmate.trainer.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.trainer.entity.TrainerProfile;

import java.time.LocalTime;
import java.util.List;

public record TrainerProfileRequest(
        String sports,
        String lessonType,
        String lessonLevel,
        Integer price,
        Integer careerYears,
        List<AvailableTimeRequest> availableTimes,
        List<String> lessonPhotoUrls,
        Boolean isPublic
) {
    public TrainerProfile toEntity(Member member) {
        return TrainerProfile.builder()
                .member(member)
                .sports(sports)
                .lessonType(lessonType)
                .lessonLevel(lessonLevel)
                .price(price)
                .careerYears(careerYears)
                .isPublic(isPublic != null ? isPublic : true)
                .build();
    }
    public record AvailableTimeRequest(
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {}
}