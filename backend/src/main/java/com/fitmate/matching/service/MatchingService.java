package com.fitmate.matching.service;

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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchingService {

    private final MatchingRequestRepository matchingRequestRepository;
    private final MatchingPreferredTimeRepository matchingPreferredTimeRepository;
    private final MatchingResultRepository matchingResultRepository;
    private final MemberRepository memberRepository;

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
}