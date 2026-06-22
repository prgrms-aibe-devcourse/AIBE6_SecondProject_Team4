package com.fitmate.auth.dto;

public record LoginResponse(
        Long memberId,
        String userName,
        String nickname,
        String role,
        String accessToken,
        String tokenType
) {
    public static LoginResponse of(String accessToken) {
        return new LoginResponse(null, null, null, null, accessToken, "Bearer");
    }

    public static LoginResponse of(Long memberId, String userName, String nickname, String role, String accessToken) {
        return new LoginResponse(memberId, userName, nickname, role, accessToken, "Bearer");
    }
}