package com.fitmate.member.service;

import com.fitmate.member.dto.MemberResponse;
import com.fitmate.member.dto.MemberUpdateRequest;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.dto.TrainerSummaryDto;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    public Member findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
    }

    public MemberResponse getMyInfo(String userId) {
        return memberRepository.findByUserId(userId)
                .map(MemberResponse::from)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Transactional
    public MemberResponse updateMyInfo(String userId, MemberUpdateRequest request) {

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        member.updateProfile(
                request.nickname(),
                request.profileImage(),
                request.region(),
                request.introduction(),
                request.phone()
        );

        return MemberResponse.from(member);
    }

    public List<TrainerSummaryDto> getTrainers() {
        return memberRepository.findByRole(Role.TRAINER)
                .stream()
                .map(TrainerSummaryDto::from)
                .toList();
    }
}
