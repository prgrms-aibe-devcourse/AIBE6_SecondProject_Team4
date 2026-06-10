package com.fitmate.auth.dto;

import com.fitmate.member.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignupRequest(
        @NotBlank String userId,
        @NotBlank String userName,
        @NotBlank String password,
        @NotBlank String nickname,
        @Email @NotBlank String email,
        @NotNull Role role,
        @NotBlank String phone
) {}
