package com.fitmate.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "401-1", "아이디 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "401-2", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "403-1", "접근 권한이 없습니다."),

    // Member
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "404-1", "회원을 찾을 수 없습니다."),
    DUPLICATE_USER_ID(HttpStatus.CONFLICT, "409-1", "이미 사용 중인 아이디입니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "409-2", "이미 사용 중인 이메일입니다."),
    USER_PROFILE_ALREADY_EXISTS(HttpStatus.CONFLICT, "409-5", "사용자 프로필이 이미 존재합니다."),

    // Trainer
    TRAINER_PROFILE_NOT_FOUND(HttpStatus.NOT_FOUND, "404-2", "트레이너 프로필을 찾을 수 없습니다."),
    TRAINER_PROFILE_ALREADY_EXISTS(HttpStatus.CONFLICT, "409-4", "이미 등록된 트레이너 프로필이 있습니다. 수정을 이용해주세요."),

    // Matching
    MATCHING_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "404-3", "매칭 요청을 찾을 수 없습니다."),
    MATCHING_RESULT_NOT_FOUND(HttpStatus.NOT_FOUND, "404-7", "매칭 결과를 찾을 수 없습니다."),

    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "404-4", "리뷰를 찾을 수 없습니다."),
    REVIEW_ALREADY_EXISTS(HttpStatus.CONFLICT, "409-3", "이미 작성된 리뷰가 있습니다."),

    // Chat
    CHAT_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "404-5", "채팅방을 찾을 수 없습니다."),

    // Alert
    ALERT_NOT_FOUND(HttpStatus.NOT_FOUND, "404-6", "알림을 찾을 수 없습니다."),

    // Lesson
    LESSON_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "404-8", "레슨 요청을 찾을 수 없습니다."),
    LESSON_REQUEST_ALREADY_EXISTS(HttpStatus.CONFLICT, "409-6", "이미 요청서를 보낸 매칭 결과입니다."),
    LESSON_REQUEST_ALREADY_PROCESSED(HttpStatus.CONFLICT, "409-7", "이미 처리된 레슨 요청입니다."),

    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "400-1", "잘못된 입력값입니다."),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "500-1", "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}