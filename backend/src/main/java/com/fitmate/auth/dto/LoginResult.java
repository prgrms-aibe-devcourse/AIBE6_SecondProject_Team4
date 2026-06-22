package com.fitmate.auth.dto;

public record LoginResult(
        Long memberId,
        String userName,
        String nickname,
        String role,
        String accessToken,
        String refreshToken
) {}