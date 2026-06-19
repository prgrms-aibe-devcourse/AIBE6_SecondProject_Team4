package com.fitmate.ai.service;

import com.fitmate.ai.client.GeminiClient;
import com.fitmate.ai.dto.AiMatchingParseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AiMatchingParseService {

    private static final Set<String> SPORTS =
            Set.of("헬스", "필라테스", "수영", "요가", "크로스핏", "테니스", "골프");

    private static final Set<String> LEVELS =
            Set.of("초급", "중급", "고급");

    private static final Set<String> LESSON_TYPES =
            Set.of("1:1 PT", "그룹", "온라인");

    private static final Set<String> REGIONS =
            Set.of("서울", "경기", "인천", "부산", "대구", "광주", "대전");

    private static final Set<String> DAYS =
            Set.of(
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY"
            );

    private final GeminiClient geminiClient;

    public AiMatchingParseResponse parse(String query) {
        return geminiClient
                .generateJson(createPrompt(query), createResponseSchema())
                .map(json -> convertResponse(json, query))
                .orElseGet(() -> emptyResponse(query));
    }

    private AiMatchingParseResponse convertResponse(
            JsonNode json,
            String originalQuery
    ) {
        List<AiMatchingParseResponse.PreferredTime> preferredTimes =
                readPreferredTimes(json.path("preferredTimes"));

        return new AiMatchingParseResponse(
                allowedValue(readText(json, "sports"), SPORTS),
                allowedValue(readText(json, "level"), LEVELS),
                allowedValue(readText(json, "lessonType"), LESSON_TYPES),
                allowedValue(readText(json, "region"), REGIONS),
                readInteger(json, "budgetMin"),
                readInteger(json, "budgetMax"),
                preferredTimes,
                originalQuery
        );
    }

    private List<AiMatchingParseResponse.PreferredTime> readPreferredTimes(
            JsonNode timesNode
    ) {
        if (!timesNode.isArray()) {
            return List.of();
        }

        List<AiMatchingParseResponse.PreferredTime> result =
                new ArrayList<>();

        for (JsonNode timeNode : timesNode) {
            String dayOfWeek = allowedValue(
                    readText(timeNode, "dayOfWeek"),
                    DAYS
            );

            LocalTime startTime =
                    readTime(timeNode, "startTime");

            LocalTime endTime =
                    readTime(timeNode, "endTime");

            if (dayOfWeek != null) {
                result.add(
                        new AiMatchingParseResponse.PreferredTime(
                                dayOfWeek,
                                startTime,
                                endTime
                        )
                );
            }
        }

        return result;
    }

    private String createPrompt(String query) {
        return """
                사용자의 문장을 FitMate 트레이너 매칭 조건으로 변환하세요.

                문장에 없는 정보는 임의로 추측하지 말고
                해당 JSON 필드를 생략하세요.

                사용할 수 있는 값:
                sports: 헬스, 필라테스, 수영, 요가, 크로스핏, 테니스, 골프
                level: 초급, 중급, 고급
                lessonType: 1:1 PT, 그룹, 온라인
                region: 서울, 경기, 인천, 부산, 대구, 광주, 대전

                dayOfWeek는 다음 값 중 하나를 사용하세요:
                MONDAY, TUESDAY, WEDNESDAY, THURSDAY,
                FRIDAY, SATURDAY, SUNDAY

                시간은 HH:mm:ss 형식으로 반환하세요.
                '저녁'처럼 정확한 시간이 없으면 시간을 생략하세요.
                예산은 원 단위 숫자로 반환하세요.

                사용자 문장:
                %s
                """.formatted(query);
    }

    private Map<String, Object> createResponseSchema() {
        Map<String, Object> stringSchema =
                Map.of("type", "string");

        Map<String, Object> integerSchema =
                Map.of("type", "integer");

        Map<String, Object> preferredTimeSchema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "dayOfWeek", stringSchema,
                        "startTime", stringSchema,
                        "endTime", stringSchema
                )
        );

        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "sports", stringSchema,
                        "level", stringSchema,
                        "lessonType", stringSchema,
                        "region", stringSchema,
                        "budgetMin", integerSchema,
                        "budgetMax", integerSchema,
                        "preferredTimes", Map.of(
                                "type", "array",
                                "items", preferredTimeSchema
                        )
                )
        );
    }

    private String readText(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);

        if (value == null || !value.isString()) {
            return null;
        }

        String text = value.stringValue();
        return text == null || text.isBlank() ? null : text.trim();
    }

    private Integer readInteger(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);

        if (value == null || !value.isIntegralNumber()) {
            return null;
        }

        int number = value.intValue();

        return number > 0 ? number : null;
    }

    private LocalTime readTime(JsonNode node, String fieldName) {
        String value = readText(node, fieldName);

        if (value == null) {
            return null;
        }

        try {
            return LocalTime.parse(value);
        } catch (Exception exception) {
            return null;
        }
    }

    private String allowedValue(
            String value,
            Set<String> allowedValues
    ) {
        return value != null && allowedValues.contains(value)
                ? value
                : null;
    }

    private AiMatchingParseResponse emptyResponse(String query) {
        return new AiMatchingParseResponse(
                null,
                null,
                null,
                null,
                null,
                null,
                List.of(),
                query
        );
    }
}