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
        Integer price,
        Integer careerYears,

        // 트레이너가 등록한 가능 시간 목록
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
                profile.getPrice(),
                profile.getCareerYears(),
                List.of()
        );
    }
    // 트레이너 프로필과 가능 시간 목록을 함께 응답으로 변환할 때 사용
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
                profile.getPrice(),
                profile.getCareerYears(),

                // TrainerAvailableTime 엔티티 목록을 화면에 보낼 DTO 목록으로 변환
                availableTimes.stream()
                        .map(AvailableTimeResponse::from)
                        .toList()
        );
    }
    // 가능 시간 1개를 응답으로 내려주는 DTO
    public record AvailableTimeResponse(
            Long id,
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
        // TrainerAvailableTime 엔티티를 AvailableTimeResponse로 변환
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