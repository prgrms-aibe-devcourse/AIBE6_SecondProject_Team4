package com.fitmate.ai.client;

import com.fitmate.ai.config.GeminiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final GeminiProperties properties;

    public GeminiClient(
            @Qualifier("geminiRestClient") RestClient restClient,
            ObjectMapper objectMapper,
            GeminiProperties properties
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    public Optional<JsonNode> generateJson(String prompt, Map<String, Object> responseSchema) {
        if (!properties.enabled()) {
            return Optional.empty();
        }

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "responseJsonSchema", responseSchema
                    )
            );

            JsonNode response = restClient.post()
                    .uri("/models/{model}:generateContent", properties.model())
                    .header("x-goog-api-key", properties.apiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);
            if (response == null) {
                log.warn("Gemini JSON generation returned an empty response");
                return Optional.empty();
            }

            JsonNode textNode = response.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");
            if (!textNode.isString()) {
                log.warn("Gemini JSON generation returned no candidate text");
                return Optional.empty();
            }

            String text = textNode.stringValue();
            if (text.isBlank()) {
                log.warn("Gemini JSON generation returned blank candidate text");
                return Optional.empty();
            }

            JsonNode parsed = objectMapper.readTree(text);
            return parsed.isMissingNode() ? Optional.empty() : Optional.of(parsed);
        } catch (RestClientException | JacksonException exception) {
            log.warn("Gemini JSON generation failed ({})",
                    exception.getClass().getSimpleName());
            return Optional.empty();
        }
    }
}
