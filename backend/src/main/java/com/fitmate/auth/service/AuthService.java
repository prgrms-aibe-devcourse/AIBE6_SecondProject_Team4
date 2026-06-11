package com.fitmate.auth.service;

import com.fitmate.auth.dto.LoginRequest;
import com.fitmate.auth.dto.LoginResponse;
import com.fitmate.auth.dto.SignupRequest;
import com.fitmate.global.config.JwtProvider;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {

        Member member = memberRepository.findByUserId(request.userId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtProvider.generateToken(member.getUserId(), member.getRole().name());

        return LoginResponse.of(token);
    }

    @Transactional
    public void signup(SignupRequest request) {

        if (memberRepository.existsByUserId(request.userId())) {
            throw new CustomException(ErrorCode.DUPLICATE_USER_ID);
        }

        if (memberRepository.existsByEmail(request.email())) {
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
}
