package com.fitmate.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),

    // Member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."),
    DUPLICATE_USER_ID(HttpStatus.CONFLICT, "이미 사용 중인 아이디입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),

    // Trainer
    TRAINER_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "트레이너 프로필을 찾을 수 없습니다."),
    TRAINER_PROFILE_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 등록된 트레이너 프로필이 있습니다. 수정을 이용해주세요."),
    
    // Matching
    MATCHING_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "매칭 요청을 찾을 수 없습니다."),

    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."),
    REVIEW_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 작성된 리뷰가 있습니다."),

    // Chat
    CHAT_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."),

    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "잘못된 입력값입니다.");



    private final HttpStatus status;
    private final String message;
}
