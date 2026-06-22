package com.fitmate.member.dto;

import com.fitmate.member.entity.Member;

public record TrainerSummaryDto(
        Long id,
        String userName,
        String profileImage
) {
    public static TrainerSummaryDto from(Member member) {
        return new TrainerSummaryDto(
                member.getId(),
                member.getNickname(),
                member.getProfileImage()
        );
    }
}
