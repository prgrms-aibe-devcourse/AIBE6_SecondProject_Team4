package com.fitmate.trainer.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.trainer.entity.TrainerProfile;

import java.time.LocalTime;
import java.util.List;

public record TrainerProfileRequest(
        String sports,
        String lessonType,
        Integer price,
        Integer careerYears,

        // 트레이너 프로필 등록 시 가능한 요일,시간 목록도 함께 받음
        List<AvailableTimeRequest> availableTimes
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
    // 가능한 시간 1개의 입력 형태
    public record AvailableTimeRequest(
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
    }
}