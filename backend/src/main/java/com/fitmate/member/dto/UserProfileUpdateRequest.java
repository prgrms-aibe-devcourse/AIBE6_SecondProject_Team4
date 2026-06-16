package com.fitmate.member.dto;

public record UserProfileUpdateRequest(
        String sports,
        String level,
        String goal
) {
}