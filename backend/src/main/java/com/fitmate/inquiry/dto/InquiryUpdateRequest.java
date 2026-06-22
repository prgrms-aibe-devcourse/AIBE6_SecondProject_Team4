package com.fitmate.inquiry.dto;

import com.fitmate.inquiry.entity.InquiryType;

public record InquiryUpdateRequest(
        InquiryType type,
        String title,
        String content
) {}
