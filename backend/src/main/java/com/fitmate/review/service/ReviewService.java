package com.fitmate.review.service;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.entity.AlertType;
import com.fitmate.alert.service.AlertService;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.repository.MatchingRequestRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.review.dto.ReviewRequest;
import com.fitmate.review.dto.ReviewResponse;
import com.fitmate.review.dto.ReviewUpdateRequest;
import com.fitmate.review.dto.TrainerRatingResponse;
import com.fitmate.review.entity.Review;
import com.fitmate.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.entity.AlertType;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final MatchingRequestRepository matchingRequestRepository;
    private final AlertService alertService;

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

    // 내가 작성한 후기 조회 (MYP-04)
    public List<ReviewResponse> getMyReviews(String userId) {
        Member reviewer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        return reviewRepository.findByReviewerId(reviewer.getId()).stream()
                .map(ReviewResponse::from)
                .toList();
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
    // 트레이너별 후기 조회
    public List<ReviewResponse> getReviewsByTrainer(Long trainerId) {
        return reviewRepository.findByTrainerId(trainerId).stream()
                .map(ReviewResponse::from)
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

    // 트레이너가 받은 후기 조회 (MYP-07)
    public List<ReviewResponse> getReceivedReviews(String userId) {
        Member trainer = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        return reviewRepository.findByTrainerId(trainer.getId()).stream()
                .map(ReviewResponse::from)
                .toList();
    }
}