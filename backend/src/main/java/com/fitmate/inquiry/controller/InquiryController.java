package com.fitmate.inquiry.controller;

import com.fitmate.inquiry.dto.InquiryRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<InquiryResponse> createInquiry(@RequestBody InquiryRequest request,
                                                          Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(inquiryService.createInquiry(memberId, request));
    }
}
