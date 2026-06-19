package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryAnswerRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.service.InquiryAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "어드민 - 문의", description = "관리자 전용 문의 관리 API (ADMIN 권한 필요)")
@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InquiryAdminController {

    private final InquiryAdminService inquiryAdminService;

    @Operation(summary = "전체 문의 목록 조회", description = "모든 회원의 문의를 오래된 순으로 페이징하여 반환합니다.")
    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getAllInquiries(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(inquiryAdminService.getAllInquiries(pageable));
    }

    @Operation(summary = "문의 답변 작성", description = "특정 문의에 관리자 답변을 등록하고 상태를 RESOLVED로 변경합니다.")
    @PostMapping("/{inquiryId}/answer")
    public ResponseEntity<InquiryResponse> writeAnswer(@PathVariable Long inquiryId,
                                                        @RequestBody InquiryAnswerRequest request) {
        return ResponseEntity.ok(inquiryAdminService.writeAnswer(inquiryId, request));
    }
}
