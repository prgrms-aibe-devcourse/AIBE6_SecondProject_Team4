package com.fitmate.chat.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ChatRoom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Member trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member user;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "hidden_by_trainer")
    private Boolean hiddenByTrainer;

    @Column(name = "hidden_by_user")
    private Boolean hiddenByUser;

    public void updateLastMessageAt(LocalDateTime time) {
        this.lastMessageAt = time;
    }

    public void hideBy(Long memberId) {
        if (trainer.getId().equals(memberId)) hiddenByTrainer = true;
        else if (user.getId().equals(memberId)) hiddenByUser = true;
    }

    public void unhideBy(Long memberId) {
        if (trainer.getId().equals(memberId)) hiddenByTrainer = false;
        else if (user.getId().equals(memberId)) hiddenByUser = false;
    }

    public boolean isHiddenFor(Long memberId) {
        if (trainer.getId().equals(memberId)) return Boolean.TRUE.equals(hiddenByTrainer);
        if (user.getId().equals(memberId)) return Boolean.TRUE.equals(hiddenByUser);
        return false;
    }
}
