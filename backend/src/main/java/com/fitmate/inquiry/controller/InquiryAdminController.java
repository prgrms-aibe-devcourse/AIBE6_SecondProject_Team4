package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryAnswerRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.service.InquiryAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InquiryAdminController {

    private final InquiryAdminService inquiryAdminService;

    @GetMapping
    public ResponseEntity<Page<InquiryResponse>> getAllInquiries(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(inquiryAdminService.getAllInquiries(pageable));
    }

    @PostMapping("/{inquiryId}/answer")
    public ResponseEntity<InquiryResponse> writeAnswer(@PathVariable Long inquiryId,
                                                        @RequestBody InquiryAnswerRequest request) {
        return ResponseEntity.ok(inquiryAdminService.writeAnswer(inquiryId, request));
    }
}
