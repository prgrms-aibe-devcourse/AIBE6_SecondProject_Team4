package com.fitmate.trainer.dto;

import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerCertification;
import com.fitmate.trainer.entity.TrainerLessonPhoto;
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
        Integer lessonDurationMinutes,
        List<AvailableTimeResponse> availableTimes,
        List<String> lessonPhotos,
        List<CertificationResponse> certifications,
        Boolean isPublic,
        Double averageRating,
        Long reviewCount
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
                profile.getLessonDurationMinutes(),
                List.of(),
                List.of(),
                List.of(),
                profile.getIsPublic(),
                null,
                null
        );
    }

    public static TrainerProfileResponse from(
            TrainerProfile profile,
            List<TrainerAvailableTime> availableTimes,
            List<TrainerLessonPhoto> lessonPhotos
    ) {
        return from(profile, availableTimes, lessonPhotos, List.of(), null, null);
    }

    public static TrainerProfileResponse from(
            TrainerProfile profile,
            List<TrainerAvailableTime> availableTimes,
            List<TrainerLessonPhoto> lessonPhotos,
            List<TrainerCertification> certifications,
            Double averageRating,
            Long reviewCount
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
                profile.getLessonDurationMinutes(),
                availableTimes.stream()
                        .map(AvailableTimeResponse::from)
                        .toList(),
                lessonPhotos.stream()
                        .map(TrainerLessonPhoto::getImageUrl)
                        .toList(),
                certifications.stream()
                        .map(CertificationResponse::from)
                        .toList(),
                profile.getIsPublic(),
                averageRating,
                reviewCount
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

    public record CertificationResponse(
            Long id,
            String name,
            Integer acquiredYear,
            String type
    ) {
        public static CertificationResponse from(TrainerCertification certification) {
            return new CertificationResponse(
                    certification.getId(),
                    certification.getName(),
                    certification.getAcquiredYear(),
                    certification.getType()
            );
        }
    }
}