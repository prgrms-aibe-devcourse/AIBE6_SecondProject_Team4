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

@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @PostMapping
    public ResponseEntity<MatchingCreateResponse> createMatchingRequest(
            @Valid @RequestBody MatchingRequestDto requestDto
    ) {
        return ResponseEntity.ok(matchingService.createMatchingRequest(requestDto));
    }
    @PostMapping("/{matchingId}/results")
    public ResponseEntity<List<MatchingResultResponse>> createMatchingResults(
            @PathVariable Long matchingId
    ) {
        return ResponseEntity.ok(matchingService.createMatchingResults(matchingId));
    }

    @GetMapping("/{matchingId}/results")
    public ResponseEntity<List<MatchingResultResponse>> getMatchingResults(
            @PathVariable Long matchingId
    ) {
        return ResponseEntity.ok(matchingService.getMatchingResults(matchingId));
    }
}