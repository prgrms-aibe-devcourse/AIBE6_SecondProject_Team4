package com.fitmate.auth.dto;

public record LoginResult(
        Long memberId,
        String userName,
        String role,
        String accessToken,
        String refreshToken
) {}