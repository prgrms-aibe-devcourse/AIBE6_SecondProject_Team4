package com.fitmate.ai.service;

import com.fitmate.ai.client.GeminiClient;
import com.fitmate.ai.dto.AiMatchingParseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AiMatchingParseService {

    private static final Set<String> SPORTS =
            Set.of("헬스", "필라테스", "수영", "요가", "크로스핏", "테니스", "골프", "댄스");

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

    private static final Set<String> PREFERENCES =
            Set.of(
                    "초보자 친화",
                    "동기부여",
                    "자세 교정",
                    "체형 개선",
                    "근력 향상",
                    "재활 경험",
                    "대회 준비",
                    "체계적인 관리",
                    "운동 습관 형성",
                    "경력 우선"
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

        String sports =
                allowedValue(readText(json, "sports"), SPORTS);
        String level =
                allowedValue(readText(json, "level"), LEVELS);
        String lessonType =
                allowedValue(readText(json, "lessonType"), LESSON_TYPES);
        String region =
                allowedValue(readText(json, "region"), REGIONS);
        String enhancedQuery = readText(json, "enhancedQuery");
        List<String> suggestedPreferences =
                readAllowedValues(
                        json.path("suggestedPreferences"),
                        PREFERENCES
                );

        if (suggestedPreferences.isEmpty()) {
            suggestedPreferences =
                    createSuggestedPreferences(
                            originalQuery,
                            sports,
                            level
                    );
        }

        return new AiMatchingParseResponse(
                sports,
                level,
                lessonType,
                region,
                readInteger(json, "budgetMin"),
                readInteger(json, "budgetMax"),
                preferredTimes,
                enhancedQuery != null ? enhancedQuery : originalQuery,
                suggestedPreferences,
                enhancedQuery != null ? enhancedQuery : originalQuery
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

            if (dayOfWeek != null) {
                result.add(
                        new AiMatchingParseResponse.PreferredTime(
                                dayOfWeek,
                                null,
                                null
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
                sports: 헬스, 필라테스, 수영, 요가, 크로스핏, 테니스, 골프, 댄스
                level: 초급, 중급, 고급
                lessonType: 1:1 PT, 그룹, 온라인
                region: 서울, 경기, 인천, 부산, 대구, 광주, 대전

                dayOfWeek는 다음 값 중 하나를 사용하세요:
                MONDAY, TUESDAY, WEDNESDAY, THURSDAY,
                FRIDAY, SATURDAY, SUNDAY

                시간 정보는 추출하지 말고 요일만 preferredTimes에 반환하세요.
                사용자가 시간을 입력해도 startTime과 endTime은 반환하지 마세요.
                예산은 원 단위 숫자로 반환하세요.

                enhancedQuery에는 사용자의 짧은 문장을 자연스러운 한국어 요청 문장
                1~2문장으로 보완해서 반환하세요.
                사용자가 말하지 않은 질병, 부상, 운동 수준, 성격, 예산, 요일은
                사실처럼 만들어내지 마세요.
                예: "서울에서 필라테스 1대1 수업"
                → "서울 지역에서 1:1 필라테스 레슨을 원합니다.
                   개인의 목표에 맞춰 세심하게 지도해 줄 트레이너를 찾고 있습니다."

                suggestedPreferences에는 사용자가 추가로 중요하게 생각할 수 있는
                선택 태그를 최대 4개까지 반환하세요.
                다음 값만 사용할 수 있습니다:
                초보자 친화, 동기부여, 자세 교정, 체형 개선, 근력 향상,
                재활 경험, 대회 준비, 체계적인 관리, 운동 습관 형성, 경력 우선
                이 값들은 추천 항목일 뿐 사용자가 직접 선택하기 전에는
                확정 조건으로 간주하지 마세요.

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
                        "dayOfWeek", stringSchema
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
                        ),
                        "enhancedQuery", stringSchema,
                        "suggestedPreferences", Map.of(
                                "type", "array",
                                "items", stringSchema
                        )
                ),
                "required", List.of(
                        "enhancedQuery",
                        "suggestedPreferences"
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

    private List<String> readAllowedValues(
            JsonNode valuesNode,
            Set<String> allowedValues
    ) {
        if (!valuesNode.isArray()) {
            return List.of();
        }

        List<String> result = new ArrayList<>();

        for (JsonNode valueNode : valuesNode) {
            if (!valueNode.isString()) {
                continue;
            }

            String value = valueNode.stringValue();

            if (allowedValues.contains(value)
                    && !result.contains(value)
                    && result.size() < 4) {
                result.add(value);
            }
        }

        return result;
    }

    private List<String> createSuggestedPreferences(
            String query,
            String sports,
            String level
    ) {
        Set<String> result = new LinkedHashSet<>();

        if ("필라테스".equals(sports) || "요가".equals(sports)) {
            result.add("자세 교정");
            result.add("체형 개선");
            result.add("체계적인 관리");
        } else if ("수영".equals(sports)) {
            result.add("초보자 친화");
            result.add("체계적인 관리");
            result.add("운동 습관 형성");
        } else if ("헬스".equals(sports) || "크로스핏".equals(sports)) {
            result.add("근력 향상");
            result.add("동기부여");
            result.add("운동 습관 형성");
        } else {
            result.add("동기부여");
            result.add("체계적인 관리");
            result.add("운동 습관 형성");
        }

        if ("초급".equals(level)) {
            result.add("초보자 친화");
        }

        if (query.contains("다이어트") || query.contains("체중")) {
            result.add("운동 습관 형성");
        }

        if (query.contains("재활")
                || query.contains("통증")
                || query.contains("부상")) {
            result.add("재활 경험");
        }

        if (query.contains("대회")) {
            result.add("대회 준비");
        }

        if (query.contains("경력")) {
            result.add("경력 우선");
        }

        return result.stream()
                .limit(4)
                .toList();
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
                query,
                List.of(),
                query
        );
    }
}
