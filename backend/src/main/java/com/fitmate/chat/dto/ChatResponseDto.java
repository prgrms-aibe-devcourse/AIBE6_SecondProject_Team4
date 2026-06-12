package com.fitmate.chat.dto;

import java.time.LocalDateTime;

/**
 * 서버 → 클라이언트로 브로드캐스트할 때 사용하는 DTO
 * 클라이언트가 메시지를 보내면, 서버는 이 형태로 구독자 전원에게 뿌린다.
 */
public record ChatResponseDto(
        Long id,
        Long chatRoomId,
        Long senderId,
        String message,
        LocalDateTime sentAt
) {}
