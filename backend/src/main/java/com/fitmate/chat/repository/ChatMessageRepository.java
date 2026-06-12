package com.fitmate.chat.repository;

import com.fitmate.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);
    Optional<ChatMessage> findTopByChatRoomIdOrderByCreatedAtDesc(Long chatRoomId);
    int countByChatRoomIdAndSenderIdNotAndIsReadFalse(Long chatRoomId, Long senderId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.isRead = false AND m.sender.id <> :memberId AND (m.chatRoom.user.id = :memberId OR m.chatRoom.trainer.id = :memberId)")
    int countTotalUnread(@Param("memberId") Long memberId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom.id = :roomId AND m.sender.id <> :memberId AND m.isRead = false")
    void markAsRead(@Param("roomId") Long roomId, @Param("memberId") Long memberId);
}
