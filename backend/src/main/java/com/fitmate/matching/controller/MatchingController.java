package com.fitmate.matching.controller;

import com.fitmate.matching.dto.MatchingCreateResponse;
import com.fitmate.matching.dto.MatchingRequestDto;
import com.fitmate.matching.service.MatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}