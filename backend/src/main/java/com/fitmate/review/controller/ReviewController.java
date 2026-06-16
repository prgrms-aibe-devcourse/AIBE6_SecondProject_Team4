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
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "후기 작성", description = "매칭 완료 후 트레이너에게 후기와 별점을 작성합니다.")
    @PostMapping
    public ResponseEntity<Long> createReview(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.createReview(userId, request));
    }

    @Operation(summary = "트레이너별 후기 목록 조회", description = "특정 트레이너가 받은 후기 목록을 조회합니다.")
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTrainer(
            @PathVariable Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByTrainer(trainerId));
    }

    @Operation(summary = "트레이너 평점 조회", description = "트레이너의 평균 평점, 후기 수, 별점 분포를 조회합니다.")
    @GetMapping("/trainer/{trainerId}/rating")
    public ResponseEntity<TrainerRatingResponse> getTrainerRating(
            @PathVariable Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getTrainerRating(trainerId));
    }

    @Operation(summary = "내가 작성한 후기 조회", description = "로그인한 사용자가 작성한 후기 목록을 조회합니다.")
    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(reviewService.getMyReviews(userId));
    }

    @Operation(summary = "받은 후기 조회", description = "트레이너가 자신이 받은 후기 목록을 조회합니다.")
    @GetMapping("/received")
    public ResponseEntity<List<ReviewResponse>> getReceivedReviews(
            @RequestParam Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getReceivedReviews(trainerId));
    }

    @Operation(summary = "후기 수정", description = "작성자 본인이 후기의 별점·내용을 수정합니다.")
    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ReviewUpdateRequest request
    ) {
        reviewService.updateReview(reviewId, userId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "후기 삭제", description = "작성자 본인이 후기를 삭제합니다.")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String userId
    ) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok().build();
    }
}