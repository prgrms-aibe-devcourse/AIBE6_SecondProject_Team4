package com.fitmate.matching.service;

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
// 매칭 요청을 불러와서 결과 생성
    @Transactional
    public List<MatchingResultResponse> createMatchingResults(Long matchingId) {
        MatchingRequest matchingRequest = matchingRequestRepository.findById(matchingId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매칭 요청입니다."));

        List<MatchingResult> existingResults = matchingResultRepository.findByMatchingRequestId(matchingId);
        if (!existingResults.isEmpty()) {
            return existingResults.stream()
                    .map(this::toMatchingResultResponse)
                    .toList();
        }
        //원하는 시간 대조
        List<MatchingPreferredTime> preferredTimes =
                matchingPreferredTimeRepository.findByMatchingRequestId(matchingId);

        //트레이너 프로필
        List<TrainerProfile> trainerProfiles = trainerProfileRepository.findAll();
        List<MatchingResult> matchingResults = new ArrayList<>();

        for (TrainerProfile trainerProfile : trainerProfiles) {
            if (Objects.equals(trainerProfile.getMember().getId(), matchingRequest.getMember().getId())) {
                continue;
            }

            if (!matchesBasicConditions(matchingRequest, trainerProfile)) {
                continue;
            }
            //트레이너 가능 시간 가져오기
            List<TrainerAvailableTime> availableTimes =
                    trainerAvailableTimeRepository.findByTrainerProfileId(trainerProfile.getId());

            for (MatchingPreferredTime preferredTime : preferredTimes) {
                for (TrainerAvailableTime availableTime : availableTimes) {
                    if (matchesTime(preferredTime, availableTime)) {
                       //조건과 시간이 맞으면 matching_results에 넣을 객체 생성
                                 matchingResults.add(MatchingResult.builder()
                                .matchingRequest(matchingRequest)
                                .trainerProfile(trainerProfile)
                                .preferredTime(preferredTime)
                                .trainerAvailableTime(availableTime)
                                .build());
                    }
                }
            }
        }
//matching_results에 저장 후 응답 DTO로 변환
        return matchingResultRepository.saveAll(matchingResults).stream()
                .map(this::toMatchingResultResponse)
                .toList();
    }
    public List<MatchingResultResponse> getMatchingResults(Long matchingId) {
        return matchingResultRepository.findByMatchingRequestId(matchingId).stream()
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