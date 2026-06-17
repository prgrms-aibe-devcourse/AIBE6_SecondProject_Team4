package com.fitmate.inquiry.service;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.entity.AlertType;
import com.fitmate.alert.service.AlertService;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.inquiry.dto.InquiryAnswerRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.entity.Inquiry;
import com.fitmate.inquiry.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryAdminService {

    private final InquiryRepository inquiryRepository;
    private final AlertService alertService;

    public Page<InquiryResponse> getAllInquiries(Pageable pageable) {
        return inquiryRepository.findAllByOrderByCreatedAtAsc(pageable)
                .map(InquiryResponse::from);
    }

    @Transactional
    public InquiryResponse writeAnswer(Long inquiryId, InquiryAnswerRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new CustomException(ErrorCode.INQUIRY_NOT_FOUND));
        inquiry.answer(request.answer());

        alertService.createAlert(new AlertRequest(
                inquiry.getMember().getId(),
                AlertType.INQUIRY,
                inquiry.getId(),
                "문의하신 내용에 답변이 등록되었습니다."
        ));

        return InquiryResponse.from(inquiry);
    }
}
