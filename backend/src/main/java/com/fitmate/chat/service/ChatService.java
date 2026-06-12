package com.fitmate.chat.service;

import com.fitmate.chat.dto.ChatResponseDto;
import com.fitmate.chat.dto.ChatRoomResponseDto;
import com.fitmate.chat.entity.ChatMessage;
import com.fitmate.chat.entity.ChatRoom;
import com.fitmate.chat.repository.ChatMessageRepository;
import com.fitmate.chat.repository.ChatRoomRepository;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    // 내 채팅방 목록 조회 (트레이너로 참여하거나 유저로 참여한 방 모두)
    public List<ChatRoomResponseDto> getChatRooms(Long memberId) {
        return chatRoomRepository.findByTrainerIdOrUserIdOrderByLastMessageAtDesc(memberId, memberId)
                .stream()
                .map(room -> {
                    String lastMessage = chatMessageRepository
                            .findTopByChatRoomIdOrderByCreatedAtDesc(room.getId())
                            .map(msg -> msg.getMessage())
                            .orElse(null);
                    int unreadCount = chatMessageRepository
                            .countByChatRoomIdAndSenderIdNotAndIsReadFalse(room.getId(), memberId);
                    return ChatRoomResponseDto.from(room, lastMessage, unreadCount);
                })
                .toList();
    }

    // 채팅방 입장 시 상대방 메시지 읽음 처리
    @Transactional
    public void markAsRead(Long roomId, Long memberId) {
        chatMessageRepository.markAsRead(roomId, memberId);
    }

    // 채팅방 메시지 히스토리 조회 (커서 기반 페이지네이션)
    public List<ChatResponseDto> getMessages(Long roomId, Long before, int size) {
        List<ChatMessage> messages = (before == null)
                ? chatMessageRepository.findByChatRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(0, size))
                : chatMessageRepository.findByChatRoomIdAndIdLessThanOrderByCreatedAtDesc(roomId, before, PageRequest.of(0, size));

        // DESC로 가져온 것을 오래된 순(ASC)으로 뒤집어서 반환
        List<ChatMessage> reversed = new ArrayList<>(messages);
        java.util.Collections.reverse(reversed);

        return reversed.stream()
                .map(msg -> new ChatResponseDto(
                        msg.getId(),
                        msg.getChatRoom().getId(),
                        msg.getSender().getId(),
                        msg.getMessage(),
                        msg.getCreatedAt()
                ))
                .toList();
    }

    // 채팅방 생성 or 기존 방 반환
    @Transactional
    public ChatRoomResponseDto getOrCreateChatRoom(Long trainerId, Long userId) {
        // 이미 존재하는 채팅방이면 그대로 반환
        return chatRoomRepository.findByTrainerIdAndUserId(trainerId, userId)
                .map(ChatRoomResponseDto::from)
                .orElseGet(() -> {
                    Member trainer = memberRepository.findById(trainerId)
                            .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
                    Member user = memberRepository.findById(userId)
                            .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

                    ChatRoom chatRoom = ChatRoom.builder()
                            .trainer(trainer)
                            .user(user)
                            .build();

                    return ChatRoomResponseDto.from(chatRoomRepository.save(chatRoom));
                });
    }
}
