package com.fitmate.member.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MemberUpdateRequest(
        @Size(max = 50)
        String nickname,

        String profileImage,

        @Size(max = 255)
        String region,

        String introduction,

        @Pattern(regexp = "^01[0-9]-?\\d{3,4}-?\\d{4}$")
        String phone
) {}