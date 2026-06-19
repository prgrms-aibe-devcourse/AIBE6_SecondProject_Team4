package com.fitmate.member.dto;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;

import java.time.LocalDateTime;

public record AdminMemberResponse(
        Long id,
        String userId,
        String userName,
        String nickname,
        String email,
        Role role,
        String phone,
        String profileImage,
        String region,
        LocalDateTime createdAt,
        boolean deleted
) {
    public static AdminMemberResponse from(Member member) {
        return new AdminMemberResponse(
                member.getId(),
                member.getUserId(),
                member.getUserName(),
                member.getNickname(),
                member.getEmail(),
                member.getRole(),
                member.getPhone(),
                member.getProfileImage(),
                member.getRegion(),
                member.getCreatedAt(),
                member.getDeletedAt() != null
        );
    }
}