package com.fitmate.auth.oauth2;

import com.fitmate.auth.entity.RefreshToken;
import com.fitmate.auth.repository.RefreshTokenRepository;
import com.fitmate.global.config.JwtProvider;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private static final String FRONTEND_REDIRECT_URI = "http://localhost:3000/oauth2/redirect";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String userId = String.valueOf(oAuth2User.getAttributes().get("id"));

        // CustomOAuth2UserService에서 만든 userId 형식과 맞추기 위해 provider 접두사 필요
        // 여기서는 attributes에 직접 접근하므로, principal에서 가져온 값이 카카오 raw id이므로 재조합 필요
        String fullUserId = "kakao_" + userId;

        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(fullUserId)
                .orElseThrow(() -> new IllegalStateException("회원을 찾을 수 없습니다."));

        String accessToken = jwtProvider.generateToken(member.getUserId(), member.getRole().name());
        String refreshToken = jwtProvider.generateRefreshToken(member.getUserId());

        saveOrUpdateRefreshToken(member.getUserId(), refreshToken);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) (jwtProvider.getRefreshExpirationMs() / 1000));
        response.addCookie(refreshCookie);

        String redirectUrl = FRONTEND_REDIRECT_URI + "?accessToken=" + accessToken;
        response.sendRedirect(redirectUrl);
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
}