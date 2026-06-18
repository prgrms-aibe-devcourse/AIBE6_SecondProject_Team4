package com.fitmate.inquiry.dto;

import com.fitmate.inquiry.entity.InquiryType;

public record InquiryRequest(
        InquiryType type,
        String title,
        String content
) {}
