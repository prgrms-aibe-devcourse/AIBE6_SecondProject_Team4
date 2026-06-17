package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.dto.InquiryUpdateRequest;
import com.fitmate.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getMyInquiries(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(inquiryService.getMyInquiries(memberId));
    }

    @GetMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> getInquiry(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(inquiryService.getInquiry(inquiryId));
    }

    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@RequestBody InquiryRequest request,
                                                          Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(inquiryService.createInquiry(memberId, request));
    }

    @PatchMapping("/{inquiryId}")
    public ResponseEntity<InquiryResponse> updateInquiry(@PathVariable Long inquiryId,
                                                          @RequestBody InquiryUpdateRequest request) {
        return ResponseEntity.ok(inquiryService.updateInquiry(inquiryId, request));
    }

    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long inquiryId, Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        inquiryService.deleteInquiry(inquiryId, memberId);
        return ResponseEntity.ok().build();
    }
}
