package com.fitmate.auth.dto;

public record LoginResponse(
        Long memberId,
        String userName,
        String role,
        String accessToken,
        String tokenType
) {
    public static LoginResponse of(Long memberId, String userName, String role, String accessToken) {
        return new LoginResponse(memberId, userName, role, accessToken, "Bearer");
    }
}
