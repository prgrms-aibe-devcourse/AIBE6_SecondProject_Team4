package com.fitmate.ai.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(GeminiProperties.class)
public class GeminiConfig {

    private static final String GEMINI_BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta";

    @Bean("geminiRestClient")
    RestClient geminiRestClient(GeminiProperties properties) {
        Duration timeout = Duration.ofSeconds(properties.timeoutSeconds());
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(timeout);
        requestFactory.setReadTimeout(timeout);

        return RestClient.builder()
                .baseUrl(GEMINI_BASE_URL)
                .requestFactory(requestFactory)
                .build();
    }
}
