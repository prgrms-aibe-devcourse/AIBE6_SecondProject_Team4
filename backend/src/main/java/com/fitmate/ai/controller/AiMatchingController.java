package com.fitmate.ai.controller;

import com.fitmate.ai.dto.AiMatchingParseRequest;
import com.fitmate.ai.dto.AiMatchingParseResponse;
import com.fitmate.ai.service.AiMatchingParseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "AI 매칭",
        description = "AI 매칭 조건 분석 API"
)
@RestController
@RequestMapping("/api/ai/matching")
@RequiredArgsConstructor
public class AiMatchingController {

    private final AiMatchingParseService aiMatchingParseService;

    @Operation(summary = "AI 한 줄 매칭 조건 해석")
    @PostMapping("/parse")
    public ResponseEntity<AiMatchingParseResponse> parseMatchingQuery(
            @Valid @RequestBody AiMatchingParseRequest request
    ) {
        return ResponseEntity.ok(
                aiMatchingParseService.parse(request.query())
        );
    }
}