package com.fitmate.trainer.dto;

import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerProfile;

import java.time.LocalTime;
import java.util.List;

public record TrainerProfileResponse(
        Long id,
        Long memberId,
        String nickname,
        String profileImage,
        String introduction,
        String region,
        String sports,
        String lessonType,
        String lessonLevel,
        Integer price,
        Integer careerYears,
        List<AvailableTimeResponse> availableTimes
) {
    public static TrainerProfileResponse from(TrainerProfile profile) {
        return new TrainerProfileResponse(
                profile.getId(),
                profile.getMember().getId(),
                profile.getMember().getNickname(),
                profile.getMember().getProfileImage(),
                profile.getMember().getIntroduction(),
                profile.getMember().getRegion(),
                profile.getSports(),
                profile.getLessonType(),
                profile.getLessonLevel(),
                profile.getPrice(),
                profile.getCareerYears(),
                List.of()
        );
    }

    public static TrainerProfileResponse from(
            TrainerProfile profile,
            List<TrainerAvailableTime> availableTimes
    ) {
        return new TrainerProfileResponse(
                profile.getId(),
                profile.getMember().getId(),
                profile.getMember().getNickname(),
                profile.getMember().getProfileImage(),
                profile.getMember().getIntroduction(),
                profile.getMember().getRegion(),
                profile.getSports(),
                profile.getLessonType(),
                profile.getLessonLevel(),
                profile.getPrice(),
                profile.getCareerYears(),
                availableTimes.stream()
                        .map(AvailableTimeResponse::from)
                        .toList()
        );
    }

    public record AvailableTimeResponse(
            Long id,
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
        public static AvailableTimeResponse from(TrainerAvailableTime time) {
            return new AvailableTimeResponse(
                    time.getId(),
                    time.getDayOfWeek(),
                    time.getStartTime(),
                    time.getEndTime()
            );
        }
    }
}