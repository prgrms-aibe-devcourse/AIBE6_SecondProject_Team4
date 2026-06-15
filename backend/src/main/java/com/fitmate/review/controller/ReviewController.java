package com.fitmate.review.controller;

import com.fitmate.review.dto.ReviewRequest;
import com.fitmate.review.dto.ReviewResponse;
import com.fitmate.review.dto.ReviewUpdateRequest;
import com.fitmate.review.dto.TrainerRatingResponse;
import com.fitmate.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 후기 작성
    @PostMapping
    public ResponseEntity<Long> createReview(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.createReview(userId, request));
    }

    // 트레이너별 후기 조회
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTrainer(
            @PathVariable Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByTrainer(trainerId));
    }

    // 평점
    @GetMapping("/trainer/{trainerId}/rating")
    public ResponseEntity<TrainerRatingResponse> getTrainerRating(
            @PathVariable Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getTrainerRating(trainerId));
    }

    // 내가 작성한 후기 (MYP-04)
    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(reviewService.getMyReviews(userId));
    }

    // 받은 후기 (MYP-07 )
    @GetMapping("/received")
    public ResponseEntity<List<ReviewResponse>> getReceivedReviews(
            @RequestParam Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getReceivedReviews(trainerId));
    }

    // 후기 수정 (REV-06)
    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ReviewUpdateRequest request
    ) {
        reviewService.updateReview(reviewId, userId, request);
        return ResponseEntity.ok().build();
    }

    // 후기 삭제 (REV-07)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String userId
    ) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok().build();
    }
}