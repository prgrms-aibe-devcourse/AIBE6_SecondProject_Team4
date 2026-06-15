package com.fitmate.auth.dto;

public record LoginResult(
        String accessToken,
        String refreshToken
) {}