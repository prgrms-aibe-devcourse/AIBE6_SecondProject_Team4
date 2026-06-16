package com.fitmate.member.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.UserProfile;

public record UserProfileRequest(
        String sports,
        String level,
        String goal
) {
    public UserProfile toEntity(Member member) {
        return UserProfile.builder()
                .member(member)
                .sports(sports)
                .level(level)
                .goal(goal)
                .build();
    }
}