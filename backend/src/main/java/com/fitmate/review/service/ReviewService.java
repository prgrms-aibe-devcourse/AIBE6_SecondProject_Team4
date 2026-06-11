package com.fitmate.review.service;

import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.repository.MatchingRequestRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.review.dto.ReviewRequest;
import com.fitmate.review.dto.ReviewResponse;
import com.fitmate.review.entity.Review;
import com.fitmate.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}