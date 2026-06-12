package com.fitmate.review.service;

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
        // 중복 방지 (REV-05): 이미 이 매칭으로 작성한 후기가 있으면 막기
        reviewRepository.findByMatchingRequestId(request.matchingId())
                .ifPresent(r -> {
                    throw new IllegalStateException("이미 해당 매칭에 대한 후기가 존재합니다.");
                });

        Member reviewer = memberRepository.findById(reviewerId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        Member trainer = memberRepository.findById(request.trainerId())
                .orElseThrow(() -> new IllegalArgumentException("트레이너를 찾을 수 없습니다."));

        MatchingRequest matching = matchingRequestRepository.findById(request.matchingId())
                .orElseThrow(() -> new IllegalArgumentException("매칭을 찾을 수 없습니다."));

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

    public TrainerRatingResponse getTrainerRating(Long trainerId) {
        Double avg = reviewRepository.findAverageRatingByTrainerId(trainerId);
        long count = reviewRepository.countByTrainerId(trainerId);
        double average = (avg == null) ? 0.0 : Math.round(avg * 10) / 10.0;

        // 별점 분포 계산 (1~5점 모두 0으로 초기화 후 채우기)
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

    // 후기 수정 (REV-06)
    @Transactional
    public void updateReview(Long reviewId, Long reviewerId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        // 작성자 본인 확인
        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new IllegalStateException("본인이 작성한 후기만 수정할 수 있습니다.");
        }

        review.update(request.rating(), request.content());
    }

    // 후기 삭제 (REV-07)
    @Transactional
    public void deleteReview(Long reviewId, Long reviewerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        // 작성자 본인 확인
        if (!review.getReviewer().getId().equals(reviewerId)) {
            throw new IllegalStateException("본인이 작성한 후기만 삭제할 수 있습니다.");
        }

        reviewRepository.delete(review);
    }
}