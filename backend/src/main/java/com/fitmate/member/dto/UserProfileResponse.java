package com.fitmate.member.dto;

import com.fitmate.member.entity.UserProfile;

public record UserProfileResponse(
        Long id,
        Long memberId,
        String nickname,
        String profileImage,
        String introduction,
        String region,
        String sports,
        String level,
        String goal
) {
    public static UserProfileResponse from(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getMember().getId(),
                profile.getMember().getNickname(),
                profile.getMember().getProfileImage(),
                profile.getMember().getIntroduction(),
                profile.getMember().getRegion(),
                profile.getSports(),
                profile.getLevel(),
                profile.getGoal()
        );
    }
}