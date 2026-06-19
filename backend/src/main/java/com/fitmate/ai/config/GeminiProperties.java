package com.fitmate.ai.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "gemini")
public record GeminiProperties(
        String apiKey,
        @NotBlank String model,
        @Positive int candidateLimit,
        @Positive int timeoutSeconds
) {

    public boolean enabled() {
        return apiKey != null && !apiKey.isBlank();
    }
}
