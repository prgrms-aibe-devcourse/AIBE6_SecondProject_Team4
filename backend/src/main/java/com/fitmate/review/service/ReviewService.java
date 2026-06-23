package com.fitmate.review.service;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.entity.AlertType;
import com.fitmate.alert.service.AlertService;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.lesson.entity.LessonRequest;
import com.fitmate.lesson.entity.LessonRequestStatus;
import com.fitmate.lesson.repository.LessonRequestRepository;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.repository.MatchingRequestRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.payment.repository.PaymentRepository;
import com.fitmate.review.dto.ReviewRequest;
import com.fitmate.review.dto.ReviewResponse;
import com.fitmate.review.dto.ReviewUpdateRequest;
import com.fitmate.review.dto.TrainerRatingResponse;
import com.fitmate.review.dto.WritableReviewResponse;
import com.fitmate.review.entity.Review;
import com.fitmate.review.repository.ReviewRepository;
import com.fitmate.trainer.entity.TrainerProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitmate.review.dto.PopularTrainerResponse;
import com.fitmate.review.dto.RealReviewResponse;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import org.springframework.data.domain.PageRequest;


import java.util.Collections;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final MatchingRequestRepository matchingRequestRepository;
    private final AlertService alertService;
    private final LessonRequestRepository lessonRequestRepository;
    private final TrainerProfileRepository trainerProfileRepository;

    // 후기 작성
    @Transactional
    public Long createReview(String userId, ReviewRequest request) {
        Member reviewer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        reviewRepository.findByMatchingRequestId(request.matchingId())
                .ifPresent(r -> {
                    throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
                });

        Member trainer = memberRepository.findById(request.trainerId())
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        MatchingRequest matching = matchingRequestRepository.findById(request.matchingId())
                .orElseThrow(() -> new CustomException(ErrorCode.MATCHING_REQUEST_NOT_FOUND));

        Review review = Review.builder()
                .matchingRequest(matching)
                .reviewer(reviewer)
                .trainer(trainer)
                .rating(request.rating())
                .content(request.content())
                .build();

        Long reviewId = reviewRepository.save(review).getId();

        // 트레이너에게 후기 알림 발송
        alertService.createAlert(new AlertRequest(
                trainer.getId(),                                  // 받는 사람 = 트레이너
                AlertType.REVIEW,                                 // 알림 타입
                trainer.getId(),                                  // targetId (트레이너 페이지 라우팅용)
                reviewer.getNickname() + "님이 후기를 남겼습니다."   // 내용
        ));

        return reviewId;
    }

    // 내가 작성한 후기 조회 (MYP-04) — 페이징
    public Page<ReviewResponse> getMyReviews(String userId, Pageable pageable) {
        Member reviewer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        return reviewRepository.findByReviewerId(reviewer.getId(), pageable)
                .map(review -> {
                    Long profileId = trainerProfileRepository.findByMemberId(review.getTrainer().getId())
                            .map(TrainerProfile::getId).orElse(null);
                    return ReviewResponse.from(review, profileId);
                });
    }

    // 후기 수정 (REV-06)
    @Transactional
    public void updateReview(Long reviewId, String userId, ReviewUpdateRequest request) {
        Member reviewer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getReviewer().getId().equals(reviewer.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        review.update(request.rating(), request.content());
    }

    // 후기 삭제 (REV-07)
    @Transactional
    public void deleteReview(Long reviewId, String userId) {
        Member reviewer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getReviewer().getId().equals(reviewer.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        reviewRepository.delete(review);
    }

    // 트레이너별 후기 조회 (공개 목록)
    public List<ReviewResponse> getReviewsByTrainer(Long trainerId) {
        Long profileId = trainerProfileRepository.findByMemberId(trainerId)
                .map(TrainerProfile::getId).orElse(null);
        return reviewRepository.findByTrainerId(trainerId).stream()
                .map(review -> ReviewResponse.from(review, profileId))
                .toList();
    }

    // 트레이너 평균 평점 + 분포
    public TrainerRatingResponse getTrainerRating(Long trainerId) {
        Double avg = reviewRepository.findAverageRatingByTrainerId(trainerId);
        long count = reviewRepository.countByTrainerId(trainerId);
        double average = (avg == null) ? 0.0 : Math.round(avg * 10) / 10.0;

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }
        for (Object[] row : reviewRepository.countRatingDistributionByTrainerId(trainerId)) {
            Integer rating = (Integer) row[0];
            Long cnt = (Long) row[1];
            distribution.put(rating, cnt);
        }

        return new TrainerRatingResponse(trainerId, average, count, distribution);
    }

    // 트레이너가 받은 후기 조회 (MYP-07) — 페이징
    public Page<ReviewResponse> getReceivedReviews(String userId, Pageable pageable) {
        Member trainer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        Long profileId = trainerProfileRepository.findByMemberId(trainer.getId())
                .map(TrainerProfile::getId).orElse(null);
        return reviewRepository.findByTrainerId(trainer.getId(), pageable)
                .map(review -> ReviewResponse.from(review, profileId));
    }

    // 리얼 후기 (메인 페이지) — 평점 4↑ + 내용 10자↑ 랜덤 3개
    public List<RealReviewResponse> getRealReviews(int size) {

        Pageable pageable = PageRequest.of(0, 100);

        List<Review> reviews = new ArrayList<>(
                reviewRepository.findRealReviews(pageable)
        );

        // 10자 미만 제거
        reviews.removeIf(review ->
                review.getContent() == null ||
                        review.getContent().length() < 10
        );

        Collections.shuffle(reviews);

        return reviews.stream()
                .limit(3)
                .map(review -> {
                    TrainerProfile profile = trainerProfileRepository
                            .findByMemberId(review.getTrainer().getId())
                            .orElse(null);

                    return new RealReviewResponse(
                            review.getId(),
                            review.getReviewer().getNickname(),
                            review.getReviewer().getProfileImage(),

                            profile != null ? profile.getId() : null,
                            review.getTrainer().getNickname(),
                            profile != null ? profile.getSports() : null,

                            review.getRating(),
                            review.getContent(),
                            review.getCreatedAt() == null
                                    ? null
                                    : review.getCreatedAt().toString()
                    );
                })
                .toList();
    }

    // 인기 트레이너 (메인 페이지) — 평점 4.5↑ & 후기 2개↑ 트레이너를 랜덤으로 N명
    public List<PopularTrainerResponse> getPopularTrainers(int size) {
        List<Object[]> rows = new ArrayList<>(reviewRepository.findPopularTrainers());
        Collections.shuffle(rows);
        List<PopularTrainerResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            if (result.size() >= size) break;
            Long trainerId = (Long) row[0];
            double avg = row[1] == null ? 0.0 : Math.round(((Double) row[1]) * 10) / 10.0;
            long count = (Long) row[2];

            Member trainer = memberRepository.findById(trainerId).orElse(null);
            if (trainer == null) continue;

            // 트레이너 프로필 (종목, 프로필 id) — 없을 수도 있으니 방어
            TrainerProfile profile = trainerProfileRepository.findByMemberId(trainerId).orElse(null);

            result.add(new PopularTrainerResponse(
                    trainerId,
                    profile != null ? profile.getId() : null,
                    trainer.getNickname(),
                    trainer.getProfileImage(),
                    profile != null ? profile.getSports() : null,
                    trainer.getRegion(),   // region 은 Member 에 있음
                    avg,
                    count
            ));
        }
        return result;
    }

    // 작성 가능한 후기 조회 (매칭 성사 + 미작성)
    // 사용자가 보낸 레슨 요청 중 ACCEPTED 상태이고, 아직 후기를 안 쓴 매칭만 반환
    public List<WritableReviewResponse> getWritableReviews(String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        List<LessonRequest> lessons =
                lessonRequestRepository.findByMemberUserIdOrderByCreatedAtDesc(userId);

        List<WritableReviewResponse> result = new ArrayList<>();
        for (LessonRequest lesson : lessons) {
            // 1) 결제 완료(COMPLETED = 매칭 완료)된 레슨만 (PAY-03)
            if (lesson.getStatus() != LessonRequestStatus.COMPLETED) {
                continue;
            }

            // 2) 이 레슨이 연결된 매칭(matching_id)
            MatchingRequest matching = lesson.getMatchingResult().getMatchingRequest();
            Long matchingId = matching.getId();

            // 3) 이미 후기를 쓴 매칭이면 제외 (review.matching_id UNIQUE)
            if (reviewRepository.findByMatchingRequestId(matchingId).isPresent()) {
                continue;
            }

            // 4) 트레이너 정보 (TrainerProfile -> Member)
            TrainerProfile trainerProfile = lesson.getTrainerProfile();
            Member trainerMember = trainerProfile.getMember();

            result.add(new WritableReviewResponse(
                    lesson.getId(),
                    matchingId,
                    trainerMember.getId(),
                    trainerMember.getNickname(),
                    trainerMember.getProfileImage(),
                    matching.getSports(),
                    lesson.getRequestedDate()
            ));
        }

        return result;
    }
}