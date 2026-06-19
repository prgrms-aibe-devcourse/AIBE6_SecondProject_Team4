package com.fitmate.lesson.controller;

import com.fitmate.lesson.dto.LessonRequestCreateRequest;
import com.fitmate.lesson.dto.LessonRequestResponse;
import com.fitmate.lesson.service.LessonRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LessonRequestController {

    private final LessonRequestService lessonRequestService;

    // 사용자가 추천 결과를 선택해서 트레이너에게 요청서를 보냄
    @Operation(summary = "레슨 요청서 생성")
    @PostMapping("/api/lesson-requests")
    public ResponseEntity<LessonRequestResponse> createLessonRequest(
            @Valid @RequestBody LessonRequestCreateRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.createLessonRequest(userId, request));
    }

    // 로그인한 트레이너가 받은 요청서 목록을 조회함
    @Operation(summary = "받은 요청서 목록 조회")
    @GetMapping("/api/trainers/me/lesson-requests")
    public ResponseEntity<List<LessonRequestResponse>> getTrainerLessonRequests(
            Authentication authentication
    ) {
        String trainerUserId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.getTrainerLessonRequests(trainerUserId));
    }

    // 로그인한 사용자가 보낸 요청서 목록을 조회함
    @Operation(summary = "보낸 요청서 목록 조회")
    @GetMapping("/api/members/me/lesson-requests")
    public ResponseEntity<List<LessonRequestResponse>> getMemberLessonRequests(
            Authentication authentication
    ) {
        String memberUserId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.getMemberLessonRequests(memberUserId));
    }

    // 요청서 상세 내용을 조회함
    @Operation(summary = "레슨 요청서 상세 조회")
    @GetMapping("/api/lesson-requests/{lessonRequestId}")
    public ResponseEntity<LessonRequestResponse> getLessonRequest(
            @PathVariable Long lessonRequestId,
            Authentication authentication
    ) {
        String userId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.getLessonRequest(lessonRequestId, userId));
    }

    // 트레이너가 레슨 요청서를 수락
    @Operation(summary = "레슨 요청서 수락")
    @PatchMapping("/api/lesson-requests/{lessonRequestId}/accept")
    public ResponseEntity<LessonRequestResponse> acceptLessonRequest(
            @PathVariable Long lessonRequestId,
            Authentication authentication
    ) {
        String trainerUserId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.acceptLessonRequest(lessonRequestId, trainerUserId));
    }

    // 트레이너가 레슨 요청서를 거절
    @Operation(summary = "레슨 요청서 거절")
    @PatchMapping("/api/lesson-requests/{lessonRequestId}/reject")
    public ResponseEntity<LessonRequestResponse> rejectLessonRequest(
            @PathVariable Long lessonRequestId,
            Authentication authentication
    ) {
        String trainerUserId = authentication.getName();

        return ResponseEntity.ok(lessonRequestService.rejectLessonRequest(lessonRequestId, trainerUserId));
    }
}
