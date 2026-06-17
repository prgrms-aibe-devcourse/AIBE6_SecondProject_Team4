package com.fitmate.chat.controller;

import com.fitmate.chat.dto.ChatResponseDto;
import com.fitmate.chat.dto.ChatRoomRequest;
import com.fitmate.chat.dto.ChatRoomResponseDto;
import com.fitmate.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Chat", description = "채팅 API")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @Operation(summary = "채팅방 목록 조회", description = "사용자의 채팅방 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ChatRoomResponseDto>> getChatRooms(@RequestParam Long memberId) {
        return ResponseEntity.ok(chatService.getChatRooms(memberId));
    }

    @Operation(summary = "채팅방 나가기", description = "채팅방을 숨김 처리합니다.")
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> hideChatRoom(@PathVariable Long roomId, @RequestParam Long memberId) {
        chatService.hideChatRoom(roomId, memberId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "메시지 읽음 처리", description = "채팅방 입장 시 안읽은 메시지를 읽음 처리합니다.")
    @PutMapping("/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long roomId, @RequestParam Long memberId) {
        chatService.markAsRead(roomId, memberId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "메시지 히스토리 조회", description = "초기 채팅 20개 조회, 상단 스크롤시 20개씩 추가조회.")
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatResponseDto>> getMessages(
            @PathVariable Long roomId,
            @RequestParam(required = false) Long before,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(chatService.getMessages(roomId, before, size));
    }

    @Operation(summary = "채팅방 생성 또는 조회", description = "트레이너와의 채팅방을 생성하거나 기존 채팅방을 반환합니다.")
    @PostMapping
    public ResponseEntity<ChatRoomResponseDto> getOrCreateChatRoom(
            @RequestBody ChatRoomRequest request) {
        return ResponseEntity.ok(chatService.getOrCreateChatRoom(request.trainerId(), request.userId()));
    }
}