package com.fitmate.chat.controller;

import com.fitmate.chat.dto.ChatMessageDto;
import com.fitmate.chat.dto.ChatResponseDto;
import com.fitmate.chat.entity.ChatMessage;
import com.fitmate.chat.entity.ChatRoom;
import com.fitmate.chat.repository.ChatMessageRepository;
import com.fitmate.chat.repository.ChatRoomRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * WebSocket(STOMP) 전용 컨트롤러
 *
 * ── 흐름 요약 ──────────────────────────────────────────────
 * 1. 클라이언트가 /pub/chat/message 로 메시지 전송
 * 2. @MessageMapping("/chat/message") 가 수신
 * 3. DB에 저장
 * 4. /sub/chat/{roomId} 를 구독 중인 모든 클라이언트에게 브로드캐스트
 * ────────────────────────────────────────────────────────────
 *
 * ※ WebSocketConfig 에서 설정된 prefix 가 적용됨
 *   - 발신 prefix : /pub  → 실제 destination: /pub/chat/message
 *   - 수신 prefix : /sub  → 실제 subscription: /sub/chat/{roomId}
 */
@Controller
@RequiredArgsConstructor
public class StompChatController {

    // SimpMessagingTemplate: 서버에서 특정 destination 으로 메시지를 직접 보낼 때 사용
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    /**
     * 클라이언트가 /pub/chat/message 로 전송한 메시지를 처리한다.
     *
     * @param dto 클라이언트가 보낸 메시지 정보 (chatRoomId, senderId, message)
     */
    @MessageMapping("/chat/message") // /pub + /chat/message = /pub/chat/message
    public void sendMessage(ChatMessageDto dto) {

        // 1. DB에서 채팅방과 발신자 조회
        ChatRoom chatRoom = chatRoomRepository.findById(dto.chatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        Member sender = memberRepository.findById(dto.senderId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 2. 메시지를 DB에 저장
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .message(dto.message())
                .isRead(false) // 처음엔 읽지 않은 상태
                .build();

        chatMessageRepository.save(chatMessage);

        // 메시지 전송 시각으로 채팅방 lastMessageAt 갱신
        chatRoom.updateLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        // 3. 응답 DTO 생성
        ChatResponseDto response = new ChatResponseDto(
                dto.chatRoomId(),
                dto.senderId(),
                dto.message(),
                LocalDateTime.now()
        );

        // 4. /sub/chat/{roomId} 를 구독 중인 클라이언트 전원에게 브로드캐스트
        messagingTemplate.convertAndSend("/sub/chat/" + dto.chatRoomId(), response);

        // 5. 수신자에게 전체 안읽은 메시지 수 실시간 알림 (모든 채팅방 합산)
        Long receiverId = chatRoom.getTrainer().getId().equals(dto.senderId())
                ? chatRoom.getUser().getId()
                : chatRoom.getTrainer().getId();

        int totalUnread = chatMessageRepository.countTotalUnread(receiverId);

        messagingTemplate.convertAndSend("/sub/notify/" + receiverId, totalUnread);
    }
}
