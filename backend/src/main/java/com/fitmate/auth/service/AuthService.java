package com.fitmate.auth.service;

import com.fitmate.auth.dto.LoginRequest;
import com.fitmate.auth.dto.LoginResult;
import com.fitmate.auth.dto.ReissueResult;
import com.fitmate.auth.dto.SignupRequest;
import com.fitmate.auth.entity.RefreshToken;
import com.fitmate.auth.repository.RefreshTokenRepository;
import com.fitmate.auth.service.SmsService;
import com.fitmate.global.config.JwtProvider;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final SmsService smsService;

    @Transactional
    public LoginResult login(LoginRequest request) {

        Member member = memberRepository.findByUserId(request.userId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));

        if (member.isDeleted()) {
            throw new CustomException(ErrorCode.WITHDRAWN_MEMBER);
        }

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtProvider.generateToken(member.getUserId(), member.getRole().name(), member.getId());
        String refreshToken = jwtProvider.generateRefreshToken(member.getUserId());

        saveOrUpdateRefreshToken(member.getUserId(), refreshToken);

        return new LoginResult(member.getId(), member.getUserName(), member.getNickname(), member.getRole().name(), accessToken, refreshToken);
    }

    private void saveOrUpdateRefreshToken(String userId, String refreshToken) {
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtProvider.getRefreshExpirationMs() / 1000);

        refreshTokenRepository.findByUserId(userId)
                .ifPresentOrElse(
                        existing -> existing.rotate(refreshToken, expiresAt),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .userId(userId)
                                        .token(refreshToken)
                                        .expiresAt(expiresAt)
                                        .build()
                        )
                );
    }

    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public void signup(SignupRequest request) {

        if (!smsService.isVerified(request.phone())) {
            throw new CustomException(ErrorCode.SMS_NOT_VERIFIED);
        }

        if (memberRepository.existsByUserIdAndDeletedAtIsNull(request.userId())) {
            throw new CustomException(ErrorCode.DUPLICATE_USER_ID);
        }

        if (memberRepository.existsByEmailAndDeletedAtIsNull(request.email())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        Member member = Member.builder()
                .userId(request.userId())
                .userName(request.userName())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .email(request.email())
                .phone(request.phone())
                .role(request.role())
                .build();

        memberRepository.save(member);
    }

    @Transactional
    public ReissueResult reissue(String refreshToken) {

        if (refreshToken == null || !jwtProvider.isValid(refreshToken)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        String userId = jwtProvider.getUserId(refreshToken);

        RefreshToken savedToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        if (!savedToken.matches(refreshToken) || savedToken.isExpired()) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        String newAccessToken = jwtProvider.generateToken(member.getUserId(), member.getRole().name(), member.getId());
        String newRefreshToken = jwtProvider.generateRefreshToken(member.getUserId());

        saveOrUpdateRefreshToken(member.getUserId(), newRefreshToken);

        return new ReissueResult(newAccessToken, newRefreshToken);
    }
}
