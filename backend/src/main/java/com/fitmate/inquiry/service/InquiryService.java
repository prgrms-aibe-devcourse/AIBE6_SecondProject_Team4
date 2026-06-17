package com.fitmate.inquiry.service;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.inquiry.dto.InquiryRequest;
import com.fitmate.inquiry.dto.InquiryResponse;
import com.fitmate.inquiry.entity.Inquiry;
import com.fitmate.inquiry.repository.InquiryRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public InquiryResponse createInquiry(Long memberId, InquiryRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Inquiry inquiry = Inquiry.builder()
                .member(member)
                .type(request.type())
                .title(request.title())
                .content(request.content())
                .build();

        return InquiryResponse.from(inquiryRepository.save(inquiry));
    }
}
