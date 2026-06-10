package com.fitmate.member.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;

public record MemberResponse(
        Long id,
        String userId,
        String userName,
        String nickname,
        String email,
        Role role,
        String profileImage,
        String region,
        String introduction,
        String phone
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getUserId(),
                member.getUserName(),
                member.getNickname(),
                member.getEmail(),
                member.getRole(),
                member.getProfileImage(),
                member.getRegion(),
                member.getIntroduction(),
                member.getPhone()
        );
    }
}
