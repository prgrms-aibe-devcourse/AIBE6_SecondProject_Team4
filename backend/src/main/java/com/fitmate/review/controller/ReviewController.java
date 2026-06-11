package com.fitmate.review.controller;

import com.fitmate.review.dto.ReviewRequest;
import com.fitmate.review.dto.ReviewResponse;
import com.fitmate.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 후기 작성
    @PostMapping
    public ResponseEntity<Long> createReview(
            @RequestParam Long reviewerId,   // 임시: 나중에 인증(로그인 사용자)으로 교체
            @Valid @RequestBody ReviewRequest request
    ) {
        Long reviewId = reviewService.createReview(reviewerId, request);
        return ResponseEntity.ok(reviewId);
    }

    // 트레이너별 후기 조회
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTrainer(
            @PathVariable Long trainerId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByTrainer(trainerId));
    }
}