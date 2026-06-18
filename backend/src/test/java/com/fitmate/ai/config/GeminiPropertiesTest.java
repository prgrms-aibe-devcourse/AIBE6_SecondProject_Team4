package com.fitmate.ai.config;

import com.fitmate.ai.client.GeminiClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class GeminiPropertiesTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TestConfiguration.class)
            .withPropertyValues(
                    "gemini.api-key=",
                    "gemini.model=gemini-3.1-flash-lite-preview",
                    "gemini.candidate-limit=10",
                    "gemini.timeout-seconds=8"
            );

    @Test
    void bindsValidPropertiesAndWiresGeminiBeans() {
        contextRunner.run(context -> {
            assertNull(context.getStartupFailure());
            assertEquals("gemini-3.1-flash-lite-preview",
                    context.getBean(GeminiProperties.class).model());
            assertNotNull(context.getBean("geminiRestClient", RestClient.class));
            assertNotNull(context.getBean(GeminiClient.class));
        });
    }

    @Test
    void rejectsInvalidRequiredProperties() {
        for (String invalidProperty : new String[]{
                "gemini.model= ",
                "gemini.candidate-limit=0",
                "gemini.timeout-seconds=0"
        }) {
            contextRunner.withPropertyValues(invalidProperty)
                    .run(context -> assertNotNull(
                            context.getStartupFailure(),
                            invalidProperty
                    ));
        }
    }

    @Configuration(proxyBeanMethods = false)
    @Import({GeminiConfig.class, GeminiClient.class})
    static class TestConfiguration {

        @Bean
        ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }
}
