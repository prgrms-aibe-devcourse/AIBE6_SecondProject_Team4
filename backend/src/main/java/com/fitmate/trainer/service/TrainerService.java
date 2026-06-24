package com.fitmate.trainer.service;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.lesson.repository.LessonRequestRepository;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.matching.repository.MatchingResultRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.review.repository.ReviewRepository;
import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerCertification;
import com.fitmate.trainer.entity.TrainerLessonPhoto;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerAvailableTimeRepository;
import com.fitmate.trainer.repository.TrainerCertificationRepository;
import com.fitmate.trainer.repository.TrainerLessonPhotoRepository;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final MemberRepository memberRepository;
    private final TrainerAvailableTimeRepository trainerAvailableTimeRepository;
    private final TrainerLessonPhotoRepository trainerLessonPhotoRepository;
    private final TrainerCertificationRepository trainerCertificationRepository;
    private final MatchingResultRepository matchingResultRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final ReviewRepository reviewRepository;

    public TrainerProfileResponse getTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        List<TrainerLessonPhoto> lessonPhotos =
                trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
        List<TrainerCertification> certifications =
                trainerCertificationRepository.findByTrainerProfileIdOrderByAcquiredYearDesc(profile.getId());
        Double avgRating = reviewRepository.findAverageRatingByTrainerId(profile.getMember().getId());
        long reviewCount = reviewRepository.countByTrainerId(profile.getMember().getId());

        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos, certifications, avgRating, reviewCount);
    }

    public Page<TrainerProfileResponse> getTrainerProfilesByFilter(
            String sport,
            String lessonType,
            String lessonLevel,
            Integer minPrice,
            Integer maxPrice,
            String region,
            int page,
            int size,
            String sort) {

        // reviewDesc인 경우 별도 쿼리 사용
        if ("reviewDesc".equals(sort)) {
            Pageable pageableNoSort = PageRequest.of(page, size);
            Page<TrainerProfile> profilePage = trainerProfileRepository.findByFiltersOrderByReviewCount(
                    sport, lessonType, lessonLevel, minPrice, maxPrice, region, pageableNoSort);

            // 이하 ratingMap, countMap 구성 및 map 로직 동일하게 처리
            List<Long> trainerIds = profilePage.getContent().stream()
                    .map(p -> p.getMember().getId()).toList();
            Map<Long, Double> ratingMap = new HashMap<>();
            Map<Long, Long> countMap = new HashMap<>();
            if (!trainerIds.isEmpty()) {
                List<Object[]> stats = reviewRepository.findRatingStatsByTrainerIds(trainerIds);
                for (Object[] row : stats) {
                    ratingMap.put((Long) row[0], (Double) row[1]);
                    countMap.put((Long) row[0], (Long) row[2]);
                }
            }
            return profilePage.map(p -> {
                List<TrainerAvailableTime> availableTimes =
                        trainerAvailableTimeRepository.findByTrainerProfileId(p.getId());
                List<TrainerLessonPhoto> lessonPhotos =
                        trainerLessonPhotoRepository.findByTrainerProfileId(p.getId());
                return TrainerProfileResponse.from(p, availableTimes, lessonPhotos, List.of(),
                        ratingMap.get(p.getMember().getId()),
                        countMap.getOrDefault(p.getMember().getId(), 0L));
            });
        }


        Sort sortObj = switch (sort) {
            case "priceAsc" -> Sort.by("price").ascending();
            case "priceDesc" -> Sort.by("price").descending();
            case "careerDesc" -> Sort.by("careerYears").descending();
            default -> Sort.by("id").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<TrainerProfile> profilePage =
                trainerProfileRepository.findByFilters(sport, lessonType, lessonLevel, minPrice, maxPrice, region, pageable);

        List<Long> trainerIds = profilePage.getContent().stream()
                .map(profile -> profile.getMember().getId())
                .toList();

        Map<Long, Double> ratingMap = new HashMap<>();
        Map<Long, Long> countMap = new HashMap<>();
        if (!trainerIds.isEmpty()) {
            List<Object[]> stats = reviewRepository.findRatingStatsByTrainerIds(trainerIds);
            for (Object[] row : stats) {
                Long trainerId = (Long) row[0];
                Double avg = (Double) row[1];
                Long count = (Long) row[2];
                ratingMap.put(trainerId, avg);
                countMap.put(trainerId, count);
            }
        }

        return profilePage.map(profile -> {
            List<TrainerAvailableTime> availableTimes =
                    trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
            List<TrainerLessonPhoto> lessonPhotos =
                    trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
            Double avgRating = ratingMap.get(profile.getMember().getId());
            Long reviewCount = countMap.getOrDefault(profile.getMember().getId(), 0L);
            return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos, List.of(), avgRating, reviewCount);
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

    @Transactional
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
                // 수정 요청에 ID가 없으면 사용자가 해당 가능 시간을 제거한 것
                if (!requestedIds.contains(existingTime.getId())) {

                    // 해당 가능 시간을 참조하는 모든 매칭 결과 조회
                    List<MatchingResult> relatedResults =
                            matchingResultRepository.findByTrainerAvailableTime_Id(
                                    existingTime.getId()
                            );

                    // 매칭 결과 중 레슨 요청으로 이어진 결과가 있는지 확인
                    boolean hasLessonRequest = relatedResults.stream()
                            .anyMatch(result ->
                                    lessonRequestRepository.existsByMatchingResultId(
                                            result.getId()
                                    )
                            );

                    // 레슨 요청이 연결되어 있으면 결과와 가능 시간 모두 보존
                    if (hasLessonRequest) {
                        throw new CustomException(
                                ErrorCode.TRAINER_AVAILABLE_TIME_IN_USE
                        );
                    }

                    // 레슨 요청으로 이어지지 않은 일회성 추천 결과 삭제
                    matchingResultRepository.deleteAll(relatedResults);

                    // matching_results 삭제 SQL을 먼저 실행하여 FK 충돌 방지
                    matchingResultRepository.flush();

                    // 관련 매칭 결과가 제거된 후 가능 시간 삭제
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

        // 자격증/수상경력 수정 - 기존 삭제 후 새로 저장
        if (request.certifications() != null) {
            trainerCertificationRepository.deleteByTrainerProfileId(profile.getId());
            List<TrainerCertification> certifications = request.certifications().stream()
                    .map(cert -> TrainerCertification.builder()
                            .trainerProfile(profile)
                            .name(cert.name())
                            .acquiredYear(cert.acquiredYear())
                            .type(cert.type())
                            .build())
                    .toList();
            trainerCertificationRepository.saveAll(certifications);
        }

        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(profile.getId());
        List<TrainerLessonPhoto> lessonPhotos =
                trainerLessonPhotoRepository.findByTrainerProfileId(profile.getId());
        List<TrainerCertification> certifications =
                trainerCertificationRepository.findByTrainerProfileIdOrderByAcquiredYearDesc(profile.getId());
        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos, certifications, null, null);
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
        List<TrainerCertification> certifications =
                trainerCertificationRepository.findByTrainerProfileIdOrderByAcquiredYearDesc(profile.getId());

        return TrainerProfileResponse.from(profile, availableTimes, lessonPhotos, certifications, null, null);
    }
}