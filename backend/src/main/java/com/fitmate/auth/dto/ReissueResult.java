package com.fitmate.auth.dto;

public record ReissueResult(
        String accessToken,
        String refreshToken
) {}