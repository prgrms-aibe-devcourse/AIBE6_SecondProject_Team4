package com.fitmate.alert.repository;

import com.fitmate.alert.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    long countByReceiverIdAndIsRead(Long receiverId, Boolean isRead);
}
