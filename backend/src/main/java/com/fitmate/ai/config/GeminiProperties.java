package com.fitmate.ai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "gemini")
public record GeminiProperties(
        String apiKey,
        String model,
        int candidateLimit,
        int timeoutSeconds
) {

    public boolean enabled() {
        return apiKey != null && !apiKey.isBlank();
    }
}
