package com.fitmate.inquiry.dto;

import com.fitmate.inquiry.entity.Inquiry;
import com.fitmate.inquiry.entity.InquiryStatus;
import com.fitmate.inquiry.entity.InquiryType;

import java.time.LocalDateTime;

public record InquiryResponse(
        Long id,
        Long memberId,
        InquiryType type,
        String title,
        String content,
        InquiryStatus status,
        String answer,
        LocalDateTime createdAt
) {
    public static InquiryResponse from(Inquiry inquiry) {
        return new InquiryResponse(
                inquiry.getId(),
                inquiry.getMember().getId(),
                inquiry.getType(),
                inquiry.getTitle(),
                inquiry.getContent(),
                inquiry.getStatus(),
                inquiry.getAnswer(),
                inquiry.getCreatedAt()
        );
    }
}
