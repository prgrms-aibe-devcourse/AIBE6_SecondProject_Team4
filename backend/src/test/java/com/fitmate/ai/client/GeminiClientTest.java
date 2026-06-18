package com.fitmate.ai.client;

import com.fitmate.ai.config.GeminiProperties;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class GeminiClientTest {

    @Test
    void returnsEmptyWithoutCallingRestClientWhenApiKeyIsBlank() {
        RestClient restClient = mock(RestClient.class);
        GeminiProperties properties = new GeminiProperties(
                "",
                "gemini-3.1-flash-lite-preview",
                10,
                8
        );
        GeminiClient client = new GeminiClient(restClient, new ObjectMapper(), properties);

        var result = client.generateJson("prompt", Map.of("type", "object"));

        assertTrue(result.isEmpty());
        verifyNoInteractions(restClient);
    }

    @Test
    void postsStructuredOutputRequestAndParsesFirstCandidateJson() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        GeminiProperties properties = new GeminiProperties(
                "test-api-key",
                "gemini-test-model",
                10,
                8
        );
        GeminiClient client = new GeminiClient(builder.build(), new ObjectMapper(), properties);
        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of("score", Map.of("type", "integer"))
        );

        server.expect(once(), requestTo(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent"
                ))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("x-goog-api-key", "test-api-key"))
                .andExpect(content().json("""
                        {
                          "contents": [
                            {
                              "parts": [
                                {
                                  "text": "Rank the trainers"
                                }
                              ]
                            }
                          ],
                          "generationConfig": {
                            "responseMimeType": "application/json",
                            "responseJsonSchema": {
                              "type": "object",
                              "properties": {
                                "score": {
                                  "type": "integer"
                                }
                              }
                            }
                          }
                        }
                        """))
                .andRespond(withSuccess("""
                        {
                          "candidates": [
                            {
                              "content": {
                                "parts": [
                                  {
                                    "text": "{\\"score\\":95}"
                                  }
                                ]
                              }
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        var result = client.generateJson("Rank the trainers", schema);

        assertTrue(result.isPresent());
        assertEquals(95, result.orElseThrow().path("score").asInt());
        server.verify();
    }

    @Test
    void returnsEmptyWhenCandidateTextIsNotValidJson() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        GeminiProperties properties = new GeminiProperties(
                "test-api-key",
                "gemini-test-model",
                10,
                8
        );
        GeminiClient client = new GeminiClient(builder.build(), new ObjectMapper(), properties);
        server.expect(once(), requestTo(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent"
                ))
                .andRespond(withSuccess("""
                        {
                          "candidates": [
                            {
                              "content": {
                                "parts": [
                                  {
                                    "text": "not-json"
                                  }
                                ]
                              }
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        var result = client.generateJson("Rank the trainers", Map.of("type", "object"));

        assertTrue(result.isEmpty());
        server.verify();
    }

    @Test
    void returnsEmptyWhenGeminiApiFails() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        GeminiProperties properties = new GeminiProperties(
                "test-api-key",
                "gemini-test-model",
                10,
                8
        );
        GeminiClient client = new GeminiClient(builder.build(), new ObjectMapper(), properties);
        server.expect(once(), requestTo(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent"
                ))
                .andRespond(withServerError());

        var result = client.generateJson("Rank the trainers", Map.of("type", "object"));

        assertTrue(result.isEmpty());
        server.verify();
    }
}
