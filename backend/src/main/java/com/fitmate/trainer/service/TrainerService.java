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
import com.fitmate.trainer.entity.TrainerLessonPhoto;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerAvailableTimeRepository;
import com.fitmate.trainer.repository.TrainerLessonPhotoRepository;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import com.fitmate.matching.repository.MatchingResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final MemberRepository memberRepository;
    private final TrainerAvailableTimeRepository trainerAvailableTimeRepository;
    private final TrainerLessonPhotoRepository trainerLessonPhotoRepository;
    private final MatchingResultRepository matchingResultRepository;

    public TrainerProfileResponse getTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        List<TrainerLessonPhoto> lessonPhotos =
                trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos);
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
                    List<TrainerLessonPhoto> lessonPhotos =
                            trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
                    return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos);
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

        if (request.availableTimes() != null && !request.availableTimes().isEmpty()) {
            List<TrainerAvailableTime> availableTimes = request.availableTimes().stream()
                    .map(time -> TrainerAvailableTime.builder()
                            .trainerProfile(saved)
                            .dayOfWeek(time.dayOfWeek())
                            .startTime(time.startTime())
                            .endTime(time.endTime())
                            .build())
                    .toList();
            trainerAvailableTimeRepository.saveAll(availableTimes);
        }

        // 레슨 사진 저장
        if (request.lessonPhotoUrls() != null && !request.lessonPhotoUrls().isEmpty()) {
            List<TrainerLessonPhoto> photos = request.lessonPhotoUrls().stream()
                    .map(url -> TrainerLessonPhoto.builder()
                            .trainerProfile(saved)
                            .imageUrl(url)
                            .build())
                    .toList();
            trainerLessonPhotoRepository.saveAll(photos);
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

        if (request.availableTimes() != null) {
            List<TrainerAvailableTime> existingTimes =
                    trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());

            Map<Long, TrainerAvailableTime> existingTimeMap =
                    existingTimes.stream()
                            .collect(Collectors.toMap(
                                    TrainerAvailableTime::getId,
                                    time -> time
                            ));

            Set<Long> requestedIds = new HashSet<>();

            for (TrainerProfileUpdateRequest.AvailableTimeRequest timeRequest
                    : request.availableTimes()) {

                if (timeRequest.id() != null) {
                    TrainerAvailableTime existingTime =
                            existingTimeMap.get(timeRequest.id());

                    if (existingTime == null) {
                        throw new CustomException(ErrorCode.INVALID_INPUT);
                    }

                    existingTime.update(
                            timeRequest.dayOfWeek(),
                            timeRequest.startTime(),
                            timeRequest.endTime()
                    );

                    requestedIds.add(existingTime.getId());
                } else {
                    TrainerAvailableTime newTime =
                            TrainerAvailableTime.builder()
                                    .trainerProfile(profile)
                                    .dayOfWeek(timeRequest.dayOfWeek())
                                    .startTime(timeRequest.startTime())
                                    .endTime(timeRequest.endTime())
                                    .build();

                    trainerAvailableTimeRepository.save(newTime);
                }
            }

            for (TrainerAvailableTime existingTime : existingTimes) {
                if (!requestedIds.contains(existingTime.getId())) {
                    boolean inUse =
                            matchingResultRepository
                                    .existsByTrainerAvailableTime_Id(existingTime.getId());

                    if (inUse) {
                        throw new CustomException(
                                ErrorCode.TRAINER_AVAILABLE_TIME_IN_USE
                        );
                    }

                    trainerAvailableTimeRepository.delete(existingTime);
                }
            }
        }

        // 레슨 사진 수정 - 기존 삭제 후 새로 저장
        if (request.lessonPhotoUrls() != null) {
            trainerLessonPhotoRepository.deleteByTrainerProfileId(profile.getId());
            List<TrainerLessonPhoto> photos = request.lessonPhotoUrls().stream()
                    .map(url -> TrainerLessonPhoto.builder()
                            .trainerProfile(profile)
                            .imageUrl(url)
                            .build())
                    .toList();
            trainerLessonPhotoRepository.saveAll(photos);
        }

        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        List<TrainerLessonPhoto> lessonPhotos =
                trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos);
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
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        List<TrainerLessonPhoto> lessonPhotos =
                trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos);
    }
}