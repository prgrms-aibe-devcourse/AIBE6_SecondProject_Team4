package com.fitmate.matching.controller;

import com.fitmate.matching.dto.MatchingCreateResponse;
import com.fitmate.matching.dto.MatchingRequestDto;
import com.fitmate.matching.service.MatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitmate.matching.dto.MatchingResultResponse;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    // 매칭 요청 생성 API
    // POST /api/matching
    @Operation(summary = "AI 매칭 요청 생성")
    @PostMapping
    public ResponseEntity<MatchingCreateResponse> createMatchingRequest(
            @Valid @RequestBody MatchingRequestDto requestDto
    ) {
        return ResponseEntity.ok(matchingService.createMatchingRequest(requestDto));
    }
    // 매칭 결과 생성 API
    // POST /api/matching/{matchingId}/results
    @Operation(summary = "AI 매칭 결과 생성")
    @PostMapping("/{matchingId}/results")
    public ResponseEntity<List<MatchingResultResponse>> createMatchingResults(
            @PathVariable Long matchingId
    ) {
        return ResponseEntity.ok(matchingService.createMatchingResults(matchingId));
    }
    // 매칭 결과 조회 API
    // GET /api/matching/{matchingId}/results
    @Operation(summary = "AI 매칭 결과 조회")
    @GetMapping("/{matchingId}/results")
    public ResponseEntity<List<MatchingResultResponse>> getMatchingResults(
            @PathVariable Long matchingId
    ) {
        return ResponseEntity.ok(matchingService.getMatchingResults(matchingId));
    }
}