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
    public MatchingCreateResponse createMatchingRequest(MatchingRequestDto requestDto) {
        Member member = memberRepository.findById(requestDto.memberId())
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
    //사용자 조건과 트레이너 조건 비교
    private boolean matchesBasicConditions(MatchingRequest matchingRequest, TrainerProfile trainerProfile) {
        return Objects.equals(matchingRequest.getSports(), trainerProfile.getSports())
                && Objects.equals(matchingRequest.getLessonType(), trainerProfile.getLessonType())
                && Objects.equals(matchingRequest.getRegion(), trainerProfile.getMember().getRegion())
                && isPriceInBudget(trainerProfile.getPrice(), matchingRequest.getBudgetMin(), matchingRequest.getBudgetMax());
    }
   // 가격 비교
    private boolean isPriceInBudget(Integer price, Integer budgetMin, Integer budgetMax) {
        if (price == null) {
            return false;
        }

        return price >= budgetMin && price <= budgetMax;
    }
    //매칭 선호 시간 , 트레이너 선호 시간 비교
    private boolean matchesTime(MatchingPreferredTime preferredTime, TrainerAvailableTime availableTime) {
        return Objects.equals(preferredTime.getDayOfWeek(), availableTime.getDayOfWeek())
                && containsTime(
                availableTime.getStartTime(),
                availableTime.getEndTime(),
                preferredTime.getStartTime(),
                preferredTime.getEndTime()
        );
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

    private MatchingResultResponse toMatchingResultResponse(MatchingResult matchingResult) {
        TrainerProfile trainerProfile = matchingResult.getTrainerProfile();
        Member trainerMember = trainerProfile.getMember();
        MatchingPreferredTime preferredTime = matchingResult.getPreferredTime();
        TrainerAvailableTime trainerAvailableTime = matchingResult.getTrainerAvailableTime();

        return new MatchingResultResponse(
                matchingResult.getId(),
                trainerProfile.getId(),
                trainerMember.getUserName(),
                trainerMember.getProfileImage(),
                trainerMember.getIntroduction(),
                trainerProfile.getSports(),
                trainerProfile.getLessonType(),
                trainerMember.getRegion(),
                trainerProfile.getPrice(),
                preferredTime.getDayOfWeek(),
                preferredTime.getStartTime(),
                preferredTime.getEndTime(),
                trainerAvailableTime.getStartTime(),
                trainerAvailableTime.getEndTime()
        );
    }
}