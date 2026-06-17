package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryAnswerRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.service.InquiryAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InquiryAdminController {

    private final InquiryAdminService inquiryAdminService;

    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getAllInquiries() {
        return ResponseEntity.ok(inquiryAdminService.getAllInquiries());
    }

    @PostMapping("/{inquiryId}/answer")
    public ResponseEntity<InquiryResponse> writeAnswer(@PathVariable Long inquiryId,
                                                        @RequestBody InquiryAnswerRequest request) {
        return ResponseEntity.ok(inquiryAdminService.writeAnswer(inquiryId, request));
    }
}
