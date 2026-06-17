package com.fitmate.trainer.service;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerAvailableTimeRepository;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final MemberRepository memberRepository;

    // 트레이너 가능 시간을 trainer_available_times 테이블에 저장하기 위한 Repository
    private final TrainerAvailableTimeRepository trainerAvailableTimeRepository;

    public TrainerProfileResponse getTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));
        // 해당 트레이너 프로필에 등록된 가능 시간 목록을 조회
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        // 트레이너 프로필 정보와 가능 시간 목록을 함께 응답으로 변환
        return TrainerProfileResponse.from(profile, availableTimes);
    }

    public Page<TrainerProfileResponse> getTrainerProfilesByFilter(
            String sport,
            String lessonType,
            Integer minPrice,
            Integer maxPrice,
            String region,
            int page,
            int size,
            String sort) {

        Sort sortObj = switch (sort) {
            case "priceAsc" -> Sort.by("price").ascending();
            case "priceDesc" -> Sort.by("price").descending();
            case "careerDesc" -> Sort.by("careerYears").descending();
            default -> Sort.by("id").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return trainerProfileRepository.findByFilters(sport, lessonType, minPrice, maxPrice, region, pageable)
                .map(profile -> {
                    List<TrainerAvailableTime> availableTimes =
                            trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
                    return TrainerProfileResponse.from(profile, availableTimes);
                });
    }

    public TrainerProfileResponse createTrainerProfile(Long memberId, TrainerProfileRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        if (member.getRole() != Role.TRAINER) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        if (trainerProfileRepository.findByMemberId(memberId).isPresent()) {
            throw new CustomException(ErrorCode.TRAINER_PROFILE_ALREADY_EXISTS);
        }

        TrainerProfile saved = trainerProfileRepository.save(request.toEntity(member));

        // 요청에 가능한 시간이 포함되어 있으면, 트레이너 프로필 저장 후 가능 시간도 함께 저장
        if (request.availableTimes() != null && !request.availableTimes().isEmpty()) {
            List<TrainerAvailableTime> availableTimes = request.availableTimes().stream()
                    .map(time -> TrainerAvailableTime.builder()
                            .trainerProfile(saved) // 방금 저장한 트레이너 프로필과 연결
                            .dayOfWeek(time.dayOfWeek())
                            .startTime(time.startTime())
                            .endTime(time.endTime())
                            .build())
                    .toList();
            // 여러 개의 가능 시간을 trainer_available_times 테이블에 한 번에 저장
            trainerAvailableTimeRepository.saveAll(availableTimes);
        }

        return TrainerProfileResponse.from(saved);
    }

    public TrainerProfileResponse updateTrainerProfile(Long id, Long memberId, TrainerProfileUpdateRequest request) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));

        if (!profile.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        profile.update(request);

        // 활동 시간 수정 - 기존 삭제 후 새로 저장
        if (request.availableTimes() != null) {
            trainerAvailableTimeRepository.deleteByTrainerProfileId(profile.getId());
            List<TrainerAvailableTime> availableTimes = request.availableTimes().stream()
                    .map(time -> TrainerAvailableTime.builder()
                            .trainerProfile(profile)
                            .dayOfWeek(time.dayOfWeek())
                            .startTime(time.startTime())
                            .endTime(time.endTime())
                            .build())
                    .toList();
            trainerAvailableTimeRepository.saveAll(availableTimes);
        }

        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        return TrainerProfileResponse.from(profile, availableTimes);
    }

    public void deleteTrainerProfile(Long id, Long memberId) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));

        if (!profile.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        trainerProfileRepository.delete(profile);
    }

    public TrainerProfileResponse getMyTrainerProfile(String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        TrainerProfile profile = trainerProfileRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));
        // 내 트레이너 프로필에 등록된 가능 시간 목록을 조회
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        // 내 트레이너 프로필 정보와 가능 시간 목록을 함께 응답으로 변환
        return TrainerProfileResponse.from(profile, availableTimes);
    }
}