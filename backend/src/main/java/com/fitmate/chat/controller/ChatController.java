package com.fitmate.chat.controller;

import com.fitmate.chat.dto.ChatResponseDto;
import com.fitmate.chat.dto.ChatRoomRequest;
import com.fitmate.chat.dto.ChatRoomResponseDto;
import com.fitmate.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 내 채팅방 목록 조회
    // TODO: JWT 구현 후 @RequestParam 제거하고 SecurityContext에서 memberId 추출
    @GetMapping
    public ResponseEntity<List<ChatRoomResponseDto>> getChatRooms(@RequestParam Long memberId) {
        return ResponseEntity.ok(chatService.getChatRooms(memberId));
    }


    // 채팅방 입장 시 읽음 처리
    // TODO: JWT 구현 후 @RequestParam 제거하고 SecurityContext에서 memberId 추출
    @PutMapping("/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long roomId, @RequestParam Long memberId) {
        chatService.markAsRead(roomId, memberId);
        return ResponseEntity.ok().build();
    }

    // 채팅방 메시지 히스토리 조회
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatResponseDto>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getMessages(roomId));
    }

    // 채팅방 생성 or 기존 방 반환
    @PostMapping
    public ResponseEntity<ChatRoomResponseDto> getOrCreateChatRoom(
            @RequestBody ChatRoomRequest request) {
        return ResponseEntity.ok(chatService.getOrCreateChatRoom(request.trainerId(), request.userId()));
    }
}