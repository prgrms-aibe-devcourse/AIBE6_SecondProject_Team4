package com.fitmate.chat.service;

import com.fitmate.chat.dto.ChatRoomResponseDto;
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
        return chatRoomRepository.findByTrainerIdOrUserId(memberId, memberId)
                .stream()
                .map(ChatRoomResponseDto::from)
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
