package com.fitmate.matching.service;

import com.fitmate.ai.dto.AiRankingResult;
import com.fitmate.ai.service.AiMatchingRecommendationService;
import com.fitmate.matching.dto.MatchingResultResponse;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerAvailableTimeRepository;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import com.fitmate.matching.dto.MatchingCreateResponse;
import com.fitmate.matching.dto.MatchingRequestDto;
import com.fitmate.matching.entity.MatchingPreferredTime;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.repository.MatchingPreferredTimeRepository;
import com.fitmate.matching.repository.MatchingRequestRepository;
import com.fitmate.matching.repository.MatchingResultRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Arrays;
import java.util.function.Function;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchingService {

    private final MatchingRequestRepository matchingRequestRepository;
    private final MatchingPreferredTimeRepository matchingPreferredTimeRepository;
    private final MatchingResultRepository matchingResultRepository;
    private final MemberRepository memberRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final TrainerAvailableTimeRepository trainerAvailableTimeRepository;
    private final AiMatchingRecommendationService aiMatchingRecommendationService;

    @Transactional
    public MatchingCreateResponse createMatchingRequest(String userId, MatchingRequestDto requestDto) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        MatchingRequest matchingRequest = MatchingRequest.builder()
                .member(member)
                .level(requestDto.level())
                .sports(requestDto.sports())
                .lessonType(requestDto.lessonType())
                .region(requestDto.region())
                .budgetMin(requestDto.budgetMin())
                .budgetMax(requestDto.budgetMax())
                .lessonContent(requestDto.lessonContent())
                .build();

        MatchingRequest savedMatchingRequest = matchingRequestRepository.save(matchingRequest);

        List<MatchingPreferredTime> preferredTimes = requestDto.preferredTimes().stream()
                .map(time -> MatchingPreferredTime.builder()
                        .matchingRequest(savedMatchingRequest)
                        .dayOfWeek(time.dayOfWeek())
                        .startTime(time.startTime())
                        .endTime(time.endTime())
                        .build())
                .toList();

        matchingPreferredTimeRepository.saveAll(preferredTimes);

        return new MatchingCreateResponse(savedMatchingRequest.getId());
    }
// 매칭 요청 조건을 비교하고 AI 추천 결과 생성
@Transactional
public List<MatchingResultResponse> createMatchingResults(
        Long matchingId
) {
    MatchingRequest matchingRequest =
            matchingRequestRepository.findById(matchingId)
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "존재하지 않는 매칭 요청입니다."
                            )
                    );

    // 이미 생성된 결과가 있으면 다시 생성하지 않고 조회
    List<MatchingResult> existingResults =
            matchingResultRepository.findByMatchingRequestId(
                    matchingId
            );

    if (!existingResults.isEmpty()) {
        return toSortedResponses(existingResults);
    }

    // 사용자가 입력한 선호 시간 조회
    List<MatchingPreferredTime> preferredTimes =
            matchingPreferredTimeRepository
                    .findByMatchingRequestId(matchingId);

    // 등록된 전체 트레이너 프로필 조회
    List<TrainerProfile> trainerProfiles =
            trainerProfileRepository.findAll();

    List<MatchingResult> matchingResults =
            new ArrayList<>();

    for (TrainerProfile trainerProfile : trainerProfiles) {

        // 사용자가 자신의 트레이너 프로필과 매칭되지 않도록 제외
        if (Objects.equals(
                trainerProfile.getMember().getId(),
                matchingRequest.getMember().getId()
        )) {
            continue;
        }

        // 종목, 수준, 유형, 지역, 가격 비교
        if (!matchesBasicConditions(
                matchingRequest,
                trainerProfile
        )) {
            continue;
        }

        // 현재 트레이너의 활동 가능 시간 조회
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository
                        .findByTrainerProfileId(
                                trainerProfile.getId()
                        );

        /*
         * 선호 시간과 트레이너 가능 시간을 비교합니다.
         * 한 트레이너가 여러 시간에 맞더라도 결과는 한 번만 생성합니다.
         */
        MatchingResult matchingResult =
                findFirstMatchingResult(
                        matchingRequest,
                        trainerProfile,
                        preferredTimes,
                        availableTimes
                );

        if (matchingResult != null) {
            matchingResults.add(matchingResult);
        }
    }

    // DB 조건에 맞는 트레이너가 없는 경우
    if (matchingResults.isEmpty()) {
        return List.of();
    }

    // DB 조건을 통과한 트레이너를 Gemini가 재정렬
    List<AiRankingResult> aiRankings =
            aiMatchingRecommendationService.rankCandidates(
                    matchingRequest,
                    matchingResults
            );

    // Gemini 추천 순위와 추천 사유를 엔티티에 적용
    applyAiRankings(
            matchingResults,
            aiRankings
    );

    // AI 추천 정보까지 matching_results 테이블에 저장
    List<MatchingResult> savedResults =
            matchingResultRepository.saveAll(matchingResults);

    // AI 추천 순위대로 정렬해서 프론트에 응답
    return toSortedResponses(savedResults);
}

    private MatchingResult findFirstMatchingResult(
            MatchingRequest matchingRequest,
            TrainerProfile trainerProfile,
            List<MatchingPreferredTime> preferredTimes,
            List<TrainerAvailableTime> availableTimes
    ) {
        for (MatchingPreferredTime preferredTime : preferredTimes) {
            for (TrainerAvailableTime availableTime : availableTimes) {

                if (matchesTime(preferredTime, availableTime)) {
                    return MatchingResult.builder()
                            .matchingRequest(matchingRequest)
                            .trainerProfile(trainerProfile)
                            .preferredTime(preferredTime)
                            .trainerAvailableTime(availableTime)
                            .build();
                }
            }
        }

        return null;
    }

    private void applyAiRankings(
            List<MatchingResult> matchingResults,
            List<AiRankingResult> aiRankings
    ) {
        Map<Long, AiRankingResult> rankingByTrainerId =
                new HashMap<>();

        for (AiRankingResult ranking : aiRankings) {
            rankingByTrainerId.put(
                    ranking.trainerProfileId(),
                    ranking
            );
        }

        for (MatchingResult matchingResult : matchingResults) {
            Long trainerProfileId =
                    matchingResult.getTrainerProfile().getId();

            AiRankingResult ranking =
                    rankingByTrainerId.get(trainerProfileId);

            if (ranking != null) {
                matchingResult.applyAiRecommendation(
                        ranking.rank(),
                        ranking.reason()
                );
            }
        }
    }
    public List<MatchingResultResponse> getMatchingResults(
            Long matchingId
    ) {
        List<MatchingResult> matchingResults =
                matchingResultRepository
                        .findByMatchingRequestId(matchingId);

        return toSortedResponses(matchingResults);
    }
    private List<MatchingResultResponse> toSortedResponses(
            List<MatchingResult> matchingResults
    ) {
        return matchingResults.stream()
                .sorted(
                        Comparator.comparing(
                                MatchingResult::getAiRank,
                                Comparator.nullsLast(
                                        Integer::compareTo
                                )
                        )
                )
                .map(this::toMatchingResultResponse)
                .toList();
    }

    // 사용자 요청 조건과 트레이너 프로필 조건 비교
    private boolean matchesBasicConditions(
            MatchingRequest request,
            TrainerProfile trainer
    ) {
        return containsValue(
                trainer.getSports(),
                request.getSports(),
                this::normalizeSport
        )
                && matchesLessonLevel(request, trainer)
                && containsValue(
                trainer.getLessonType(),
                request.getLessonType(),
                this::normalizeLessonType
        )
                && Objects.equals(
                request.getRegion().trim(),
                trainer.getMember().getRegion().trim()
        )
                && isPriceInBudget(
                trainer.getPrice(),
                request.getBudgetMin(),
                request.getBudgetMax()
        );
    }

    // 트레이너가 여러 레벨을 담당할 수 있으므로 "중급,고급" 같은 문자열을 나눠서 비교
    private boolean matchesLessonLevel(
            MatchingRequest request,
            TrainerProfile trainer
    ) {
        return containsValue(
                trainer.getLessonLevel(),
                request.getLevel(),
                this::normalizeLessonLevel
        );
    }

   // 가격 비교
    private boolean isPriceInBudget(Integer price, Integer budgetMin, Integer budgetMax) {
        if (price == null) {
            return false;
        }

        return price >= budgetMin && price <= budgetMax;
    }
    //매칭 선호 시간 , 트레이너 선호 시간 비교
    private boolean matchesTime(
            MatchingPreferredTime preferredTime,
            TrainerAvailableTime availableTime
    ) {
        return Objects.equals(
                normalizeDay(preferredTime.getDayOfWeek()),
                normalizeDay(availableTime.getDayOfWeek())
        )
                && containsTime(
                availableTime.getStartTime(),
                availableTime.getEndTime(),
                preferredTime.getStartTime(),
                preferredTime.getEndTime()
        );
    }

    private boolean containsValue(
            String storedValues,
            String requestedValue,
            Function<String, String> normalizer
    ) {
        if (storedValues == null || requestedValue == null) {
            return false;
        }

        String normalizedRequest = normalizer.apply(requestedValue);

        return Arrays.stream(storedValues.split(","))
                .map(String::trim)
                .map(normalizer)
                .anyMatch(normalizedRequest::equals);
    }

    private boolean containsTime(
            LocalTime availableStartTime,
            LocalTime availableEndTime,
            LocalTime preferredStartTime,
            LocalTime preferredEndTime
    ) {
        return !availableStartTime.isAfter(preferredStartTime)
                && !availableEndTime.isBefore(preferredEndTime);
    }

    private MatchingResultResponse toMatchingResultResponse(
            MatchingResult matchingResult
    ) {
        TrainerProfile trainerProfile =
                matchingResult.getTrainerProfile();

        Member trainerMember =
                trainerProfile.getMember();

        MatchingPreferredTime preferredTime =
                matchingResult.getPreferredTime();

        TrainerAvailableTime trainerAvailableTime =
                matchingResult.getTrainerAvailableTime();

        return new MatchingResultResponse(
                matchingResult.getId(),
                trainerProfile.getId(),
                trainerMember.getUserName(),
                trainerMember.getProfileImage(),
                trainerMember.getIntroduction(),
                trainerProfile.getSports(),
                trainerProfile.getLessonType(),
                trainerProfile.getLessonLevel(),
                trainerMember.getRegion(),
                trainerProfile.getPrice(),
                preferredTime.getDayOfWeek(),
                preferredTime.getStartTime(),
                preferredTime.getEndTime(),
                trainerAvailableTime.getStartTime(),
                trainerAvailableTime.getEndTime(),

                // matching_results에 저장된 AI 추천 정보
                matchingResult.getAiRank(),
                matchingResult.getAiReason()
        );
    }

    private String normalizeSport(String value) {
        String normalized = normalizeText(value);

        return switch (normalized) {
            case "PT", "헬스", "웨이트" -> "헬스";
            default -> normalized;
        };
    }

    private String normalizeLessonType(String value) {
        return switch (normalizeText(value)) {
            case "ONE_TO_ONE", "1:1", "1:1PT", "개인" -> "ONE_TO_ONE";
            case "GROUP", "그룹" -> "GROUP";
            case "ONLINE", "온라인" -> "ONLINE";
            default -> normalizeText(value);
        };
    }

    private String normalizeLessonLevel(String value) {
        return switch (normalizeText(value)) {
            case "입문", "초보", "초급", "입문/초보" -> "BEGINNER";
            case "중급" -> "INTERMEDIATE";
            case "고급", "대회준비", "고급/대회준비" -> "ADVANCED";
            default -> normalizeText(value);
        };
    }

    private String normalizeDay(String value) {
        return switch (normalizeText(value)) {
            case "MON", "MONDAY", "월", "월요일" -> "MON";
            case "TUE", "TUESDAY", "화", "화요일" -> "TUE";
            case "WED", "WEDNESDAY", "수", "수요일" -> "WED";
            case "THU", "THURSDAY", "목", "목요일" -> "THU";
            case "FRI", "FRIDAY", "금", "금요일" -> "FRI";
            case "SAT", "SATURDAY", "토", "토요일" -> "SAT";
            case "SUN", "SUNDAY", "일", "일요일" -> "SUN";
            default -> normalizeText(value);
        };
    }

    private String normalizeText(String value) {
        return value == null
                ? ""
                : value.trim().replace(" ", "").toUpperCase();
    }
}