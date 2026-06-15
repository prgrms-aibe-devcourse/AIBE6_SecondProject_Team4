package com.fitmate.review.service;

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

    // 후기 작성
    @Transactional
    public Long createReview(Long reviewerId, ReviewRequest request) {
        // 중복 방지 (REV-05)
        reviewRepository.findByMatchingRequestId(request.matchingId())
                .ifPresent(r -> {
                    throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
                });

        Member reviewer = memberRepository.findById(reviewerId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

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

        return reviewRepository.save(review).getId();
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

    // 내가 작성한 후기 조회 (MYP-04)
    public List<ReviewResponse> getMyReviews(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    // 트레이너가 받은 후기 조회 (MYP-07)
    public List<ReviewResponse> getReceivedReviews(Long trainerId) {
        return reviewRepository.findByTrainerId(trainerId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    // 후기 수정 (REV-06)
    @Transactional
    public void updateReview(Long reviewId, Long reviewerId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        review.update(request.rating(), request.content());
    }

    // 후기 삭제 (REV-07)
    @Transactional
    public void deleteReview(Long reviewId, Long reviewerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        reviewRepository.delete(review);
    }
}