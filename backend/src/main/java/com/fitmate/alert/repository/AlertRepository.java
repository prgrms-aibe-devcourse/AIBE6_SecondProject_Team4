package com.fitmate.alert.repository;

import com.fitmate.alert.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    long countByReceiverIdAndIsRead(Long receiverId, Boolean isRead);
    void deleteByReceiverId(Long receiverId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Alert a SET a.isRead = true WHERE a.receiver.id = :memberId AND a.isRead = false")
    void markAllAsRead(Long memberId);
}
