package com.fitmate.auth.controller;

import com.fitmate.auth.dto.ReissueResult;
import com.fitmate.auth.dto.LoginRequest;
import com.fitmate.auth.dto.LoginResponse;
import com.fitmate.auth.dto.LoginResult;
import com.fitmate.auth.dto.SignupRequest;
import com.fitmate.auth.service.AuthService;
import com.fitmate.global.config.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletResponse response) {

        LoginResult result = authService.login(request);

        Cookie refreshCookie = new Cookie("refreshToken", result.refreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false); // 운영 배포 시 true (HTTPS)
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) (jwtProvider.getRefreshExpirationMs() / 1000));
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(LoginResponse.of(result.accessToken()));
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reissue")
    public ResponseEntity<LoginResponse> reissue(@CookieValue(value = "refreshToken", required = false) String refreshToken,
                                                 HttpServletResponse response) {

        ReissueResult result = authService.reissue(refreshToken);

        Cookie refreshCookie = new Cookie("refreshToken", result.refreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) (jwtProvider.getRefreshExpirationMs() / 1000));
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(LoginResponse.of(result.accessToken()));
    }
}
