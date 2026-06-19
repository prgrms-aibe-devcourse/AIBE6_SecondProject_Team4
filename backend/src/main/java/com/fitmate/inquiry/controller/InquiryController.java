package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.dto.InquiryUpdateRequest;
import com.fitmate.inquiry.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "문의", description = "1:1 문의 CRUD API")
@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @Operation(summary = "내 문의 목록 조회", description = "로그인한 회원의 문의 목록을 페이징하여 반환합니다.")
    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getMyInquiries(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(inquiryService.getMyInquiries(memberId, pageable));
    }

    @Operation(summary = "문의 단건 조회", description = "문의 ID로 특정 문의를 조회합니다.")
    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> getInquiry(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(inquiryService.getInquiry(inquiryId));
    }

    @Operation(summary = "문의 작성", description = "새 문의를 등록합니다.")
    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@RequestBody InquiryRequest request,
                                                          Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(inquiryService.createInquiry(memberId, request));
    }

    @Operation(summary = "문의 수정", description = "답변 대기(PENDING) 상태인 문의의 유형·제목·내용을 수정합니다.")
    @PatchMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> updateInquiry(@PathVariable Long inquiryId,
                                                          @RequestBody InquiryUpdateRequest request) {
        return ResponseEntity.ok(inquiryService.updateInquiry(inquiryId, request));
    }

    @Operation(summary = "문의 삭제", description = "본인 소유 문의를 삭제합니다.")
    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long inquiryId, Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        inquiryService.deleteInquiry(inquiryId, memberId);
        return ResponseEntity.ok().build();
    }
}
