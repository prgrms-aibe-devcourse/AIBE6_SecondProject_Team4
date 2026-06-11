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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {

        Member member = memberRepository.findByUserId(request.userId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        String token = jwtProvider.generateToken(member.getUserId(), member.getRole().name());

        return LoginResponse.of(token);
    }

    @Transactional
    public void signup(SignupRequest request) {

        if (memberRepository.existsByUserId(request.userId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
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
