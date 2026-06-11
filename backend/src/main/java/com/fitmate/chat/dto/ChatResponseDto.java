package com.fitmate.chat.dto;

import java.time.LocalDateTime;

/**
 * 서버 → 클라이언트로 브로드캐스트할 때 사용하는 DTO
 * 클라이언트가 메시지를 보내면, 서버는 이 형태로 구독자 전원에게 뿌린다.
 */
public record ChatResponseDto(
        Long chatRoomId,    // 어느 채팅방 메시지인지
        Long senderId,      // 누가 보냈는지
        String message,     // 메시지 내용
        LocalDateTime sentAt // 전송 시각
) {}
