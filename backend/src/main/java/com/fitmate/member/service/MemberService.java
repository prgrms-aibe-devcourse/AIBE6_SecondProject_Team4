package com.fitmate.member.service;

import com.fitmate.member.dto.MemberResponse;
import com.fitmate.member.dto.MemberUpdateRequest;
import com.fitmate.member.dto.PasswordChangeRequest;
import com.fitmate.member.dto.RoleChangeRequest;
import com.fitmate.auth.repository.RefreshTokenRepository;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.dto.TrainerSummaryDto;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

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
                request.phone(),
                request.email()
        );

        return MemberResponse.from(member);
    }

    public List<TrainerSummaryDto> getTrainers() {
        return memberRepository.findByRole(Role.TRAINER)
                .stream()
                .map(TrainerSummaryDto::from)
                .toList();
    }

    @Transactional
    public void deleteMyAccount(String userId) {
        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        member.delete();
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public void changePassword(String userId, PasswordChangeRequest request) {

        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        if (!passwordEncoder.matches(request.currentPassword(), member.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }

        member.changePassword(passwordEncoder.encode(request.newPassword()));
    }

    public void verifyPassword(String userId, String currentPassword) {
        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    @Transactional
    public void changeRole(String userId, RoleChangeRequest request) {
        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Role newRole = Role.valueOf(request.role().name());
        member.changeRole(newRole);
    }
}
