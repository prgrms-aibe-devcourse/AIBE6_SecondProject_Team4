package com.fitmate.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AiMatchingParseRequest(
        @NotBlank
        @Size(max = 500)
        String query
) {
}