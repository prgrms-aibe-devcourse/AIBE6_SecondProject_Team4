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
        List<String> lessonPhotoUrls
) {
    public TrainerProfile toEntity(Member member) {
        return TrainerProfile.builder()
                .member(member)
                .sports(sports)
                .lessonType(lessonType)
                .lessonLevel(lessonLevel)
                .price(price)
                .careerYears(careerYears)
                .build();
    }
    public record AvailableTimeRequest(
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {}
}