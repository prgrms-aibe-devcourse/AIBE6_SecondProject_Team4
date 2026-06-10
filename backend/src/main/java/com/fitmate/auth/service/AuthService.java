package com.fitmate.auth.service;

import com.fitmate.auth.dto.LoginRequest;
import com.fitmate.auth.dto.LoginResponse;
import com.fitmate.auth.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    public LoginResponse login(LoginRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Transactional
    public void signup(SignupRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
