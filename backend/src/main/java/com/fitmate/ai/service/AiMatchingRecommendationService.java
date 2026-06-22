package com.fitmate.ai.service;

import com.fitmate.ai.client.GeminiClient;
import com.fitmate.ai.config.GeminiProperties;
import com.fitmate.ai.dto.AiRankingResult;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.trainer.entity.TrainerProfile;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AiMatchingRecommendationService {

    private static final Logger log =
            LoggerFactory.getLogger(AiMatchingRecommendationService.class);

    private final GeminiClient geminiClient;
    private final GeminiProperties geminiProperties;
    private final ObjectMapper objectMapper;

    public List<AiRankingResult> rankCandidates(
            MatchingRequest matchingRequest,
            List<MatchingResult> matchingResults
    ) {
        if (matchingResults.isEmpty()) {
            return List.of();
        }

        List<MatchingResult> candidates =
                selectUniqueCandidates(matchingResults);

        if (!geminiProperties.enabled()) {
            return createFallbackRanking(candidates);
        }

        Optional<String> prompt =
                createPrompt(matchingRequest, candidates);

        if (prompt.isEmpty()) {
            return createFallbackRanking(candidates);
        }

        return geminiClient
                .generateJson(prompt.get(), createResponseSchema())
                .map(json -> validateAiResponse(json, candidates))
                .orElseGet(() -> createFallbackRanking(candidates));
    }

    /**
     * 같은 트레이너가 여러 시간 조건에 일치하더라도
     * Gemini에게는 트레이너당 한 번만 전달합니다.
     */
    private List<MatchingResult> selectUniqueCandidates(
            List<MatchingResult> matchingResults
    ) {
        Map<Long, MatchingResult> uniqueCandidates =
                new LinkedHashMap<>();

        for (MatchingResult result : matchingResults) {
            Long trainerProfileId =
                    result.getTrainerProfile().getId();

            uniqueCandidates.putIfAbsent(
                    trainerProfileId,
                    result
            );
        }

        return uniqueCandidates.values()
                .stream()
                .limit(geminiProperties.candidateLimit())
                .toList();
    }

    private Optional<String> createPrompt(
            MatchingRequest matchingRequest,
            List<MatchingResult> candidates
    ) {
        try {
            Map<String, Object> requestData =
                    createRequestData(matchingRequest);

            List<Map<String, Object>> candidateData =
                    candidates.stream()
                            .map(this::createCandidateData)
                            .toList();

            String requestJson =
                    objectMapper.writeValueAsString(requestData);

            String candidateJson =
                    objectMapper.writeValueAsString(candidateData);

            return Optional.of("""
                    FitMate의 트레이너 후보들을 사용자에게 적합한 순서로 정렬하세요.

                    다음 규칙을 반드시 지키세요.

                    1. 제공된 후보 트레이너만 사용할 수 있습니다.
                    2. 트레이너 프로필에 없는 전문성이나 자격을 만들지 마세요.
                    3. 질병을 진단하거나 치료 효과를 보장하지 마세요.
                    4. 사용자의 목표 및 요청사항과 관련성이 높은 후보를 우선하세요.
                    5. 추천 사유는 한국어로 작성하고 500자를 넘지 마세요.
                    6. 모든 후보에게 서로 다른 순위를 부여하세요.
                    7. trainerProfileId는 제공된 값을 그대로 사용하세요.

                    사용자 요청:
                    %s

                    트레이너 후보:
                    %s
                    """.formatted(requestJson, candidateJson));

        } catch (Exception exception) {
            log.warn(
                    "AI 추천 프롬프트 생성에 실패했습니다: {}",
                    exception.getClass().getSimpleName()
            );

            return Optional.empty();
        }
    }

    private Map<String, Object> createRequestData(
            MatchingRequest request
    ) {
        Map<String, Object> data = new LinkedHashMap<>();

        data.put("sports", request.getSports());
        data.put("level", request.getLevel());
        data.put("lessonType", request.getLessonType());
        data.put("region", request.getRegion());
        data.put("budgetMin", request.getBudgetMin());
        data.put("budgetMax", request.getBudgetMax());
        data.put("lessonContent", request.getLessonContent());

        return data;
    }

    private Map<String, Object> createCandidateData(
            MatchingResult matchingResult
    ) {
        TrainerProfile trainerProfile =
                matchingResult.getTrainerProfile();

        Map<String, Object> data = new LinkedHashMap<>();

        data.put(
                "trainerProfileId",
                trainerProfile.getId()
        );

        data.put(
                "sports",
                trainerProfile.getSports()
        );

        data.put(
                "lessonType",
                trainerProfile.getLessonType()
        );

        data.put(
                "lessonLevel",
                trainerProfile.getLessonLevel()
        );

        data.put(
                "region",
                trainerProfile.getMember().getRegion()
        );

        data.put(
                "price",
                trainerProfile.getPrice()
        );

        data.put(
                "careerYears",
                trainerProfile.getCareerYears()
        );

        data.put(
                "introduction",
                trainerProfile.getMember().getIntroduction()
        );

        data.put(
                "matchedDayOfWeek",
                matchingResult.getPreferredTime().getDayOfWeek()
        );

        return data;
    }

    private List<AiRankingResult> validateAiResponse(
            JsonNode json,
            List<MatchingResult> candidates
    ) {
        Set<Long> allowedTrainerIds =
                new LinkedHashSet<>();

        for (MatchingResult candidate : candidates) {
            allowedTrainerIds.add(
                    candidate.getTrainerProfile().getId()
            );
        }

        Set<Long> usedTrainerIds = new HashSet<>();
        Set<Integer> usedRanks = new HashSet<>();

        List<AiRankingResult> validatedResults =
                new ArrayList<>();

        JsonNode rankingsNode = json.path("rankings");

        if (rankingsNode.isArray()) {
            for (JsonNode rankingNode : rankingsNode) {
                Long trainerProfileId =
                        readLong(rankingNode, "trainerProfileId");

                Integer rank =
                        readInteger(rankingNode, "rank");

                String reason =
                        readText(rankingNode, "reason");

                if (trainerProfileId == null
                        || rank == null
                        || rank < 1
                        || !allowedTrainerIds.contains(trainerProfileId)
                        || usedTrainerIds.contains(trainerProfileId)
                        || usedRanks.contains(rank)) {
                    continue;
                }

                usedTrainerIds.add(trainerProfileId);
                usedRanks.add(rank);

                validatedResults.add(
                        new AiRankingResult(
                                trainerProfileId,
                                rank,
                                limitReason(reason)
                        )
                );
            }
        }

        validatedResults.sort(
                Comparator.comparing(AiRankingResult::rank)
        );

        /*
         * Gemini가 2순위부터 반환하거나 일부 후보를 빠뜨려도
         * 최종 순위가 1, 2, 3 순서가 되도록 다시 정리합니다.
         */
        List<AiRankingResult> normalizedResults =
                new ArrayList<>();

        for (AiRankingResult result : validatedResults) {
            normalizedResults.add(
                    new AiRankingResult(
                            result.trainerProfileId(),
                            normalizedResults.size() + 1,
                            result.reason()
                    )
            );
        }

        /*
         * Gemini 응답에서 누락된 후보는
         * 기존 DB 조회 순서대로 뒤에 추가합니다.
         */
        for (Long trainerProfileId : allowedTrainerIds) {
            if (usedTrainerIds.add(trainerProfileId)) {
                normalizedResults.add(
                        new AiRankingResult(
                                trainerProfileId,
                                normalizedResults.size() + 1,
                                createFallbackReason()
                        )
                );
            }
        }

        return normalizedResults;
    }

    private List<AiRankingResult> createFallbackRanking(
            List<MatchingResult> candidates
    ) {
        List<AiRankingResult> results =
                new ArrayList<>();

        for (int index = 0; index < candidates.size(); index++) {
            Long trainerProfileId =
                    candidates.get(index)
                            .getTrainerProfile()
                            .getId();

            results.add(
                    new AiRankingResult(
                            trainerProfileId,
                            index + 1,
                            createFallbackReason()
                    )
            );
        }

        return results;
    }

    private String createFallbackReason() {
        return "요청한 종목, 레슨 수준, 유형, 지역, 예산과 선호 시간 조건을 모두 충족하는 트레이너입니다.";
    }

    private Map<String, Object> createResponseSchema() {
        Map<String, Object> rankingSchema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "trainerProfileId", Map.of(
                                "type", "integer"
                        ),
                        "rank", Map.of(
                                "type", "integer"
                        ),
                        "reason", Map.of(
                                "type", "string"
                        )
                ),
                "required", List.of(
                        "trainerProfileId",
                        "rank",
                        "reason"
                )
        );

        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "rankings", Map.of(
                                "type", "array",
                                "items", rankingSchema
                        )
                ),
                "required", List.of("rankings")
        );
    }

    private String readText(
            JsonNode node,
            String fieldName
    ) {
        JsonNode value = node.get(fieldName);

        if (value == null || !value.isString()) {
            return null;
        }

        String text = value.stringValue();

        return text == null || text.isBlank()
                ? null
                : text.trim();
    }

    private Long readLong(
            JsonNode node,
            String fieldName
    ) {
        JsonNode value = node.get(fieldName);

        if (value == null || !value.isIntegralNumber()) {
            return null;
        }

        return value.longValue();
    }

    private Integer readInteger(
            JsonNode node,
            String fieldName
    ) {
        JsonNode value = node.get(fieldName);

        if (value == null || !value.isIntegralNumber()) {
            return null;
        }

        return value.intValue();
    }

    private String limitReason(String reason) {
        if (reason == null) {
            return null;
        }

        if (reason.length() <= 500) {
            return reason;
        }

        return reason.substring(0, 500);
    }
}
