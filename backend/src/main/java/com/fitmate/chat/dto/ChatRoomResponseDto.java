package com.fitmate.chat.dto;

import com.fitmate.chat.entity.ChatRoom;

import java.time.LocalDateTime;

public record ChatRoomResponseDto(
        Long chatRoomId,
        Long trainerId,
        String trainerName,
        String trainerProfile,
        Long userId,
        String userName,
        LocalDateTime createdAt,
        LocalDateTime lastMessageAt,
        String lastMessage,
        int unreadCount
){
    public static ChatRoomResponseDto from(ChatRoom chatRoom) {
        return new ChatRoomResponseDto(
                chatRoom.getId(),
                chatRoom.getTrainer().getId(),
                chatRoom.getTrainer().getUserName(),
                chatRoom.getTrainer().getProfileImage(),
                chatRoom.getUser().getId(),
                chatRoom.getUser().getUserName(),
                chatRoom.getCreatedAt(),
                chatRoom.getLastMessageAt(),
                null,
                0
        );
    }

    public static ChatRoomResponseDto from(ChatRoom chatRoom, String lastMessage, int unreadCount) {
        return new ChatRoomResponseDto(
                chatRoom.getId(),
                chatRoom.getTrainer().getId(),
                chatRoom.getTrainer().getUserName(),
                chatRoom.getTrainer().getProfileImage(),
                chatRoom.getUser().getId(),
                chatRoom.getUser().getUserName(),
                chatRoom.getCreatedAt(),
                chatRoom.getLastMessageAt(),
                lastMessage,
                unreadCount
        );
    }
}
