package com.fitmate.auth.service;

import com.fitmate.auth.dto.LoginRequest;
import com.fitmate.auth.dto.LoginResponse;
import com.fitmate.auth.dto.SignupRequest;
import com.fitmate.global.config.JwtProvider;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 로그인 → JWT 토큰 반환
    public LoginResponse login(LoginRequest request) {
        // 1. 아이디로 회원 조회
        Member member = memberRepository.findByUserId(request.userId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);
        }

        // 3. JWT 토큰 생성 후 반환
        String token = jwtProvider.generateToken(member.getUserId(), member.getRole().name());
        return LoginResponse.of(token);
    }

    // 회원가입
    @Transactional
    public void signup(SignupRequest request) {
        // 중복 검사
        if (memberRepository.existsByUserId(request.userId())) {
            throw new CustomException(ErrorCode.DUPLICATE_USER_ID);
        }
        if (memberRepository.existsByEmail(request.email())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 비밀번호 암호화 후 저장
        Member member = Member.builder()
                .userId(request.userId())
                .userName(request.userName())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .email(request.email())
                .role(request.role())
                .phone(request.phone())
                .build();

        memberRepository.save(member);
    }
}
