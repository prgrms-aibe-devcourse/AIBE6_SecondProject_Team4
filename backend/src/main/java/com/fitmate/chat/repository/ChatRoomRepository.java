package com.fitmate.chat.repository;

import com.fitmate.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByTrainerIdOrUserIdOrderByLastMessageAtDesc(Long trainerId, Long userId);
    Optional<ChatRoom> findByTrainerIdAndUserId(Long trainerId, Long userId);
}
