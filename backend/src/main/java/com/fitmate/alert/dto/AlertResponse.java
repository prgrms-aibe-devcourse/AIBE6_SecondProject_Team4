package com.fitmate.alert.dto;

import com.fitmate.alert.entity.Alert;
import com.fitmate.alert.entity.AlertType;

import java.time.LocalDateTime;

public record AlertResponse(
        Long id,
        AlertType type,
        Long targetId,
        String content,
        Boolean isRead,
        LocalDateTime createdAt
) {
    public static AlertResponse from(Alert alert) {
        return new AlertResponse(
                alert.getId(),
                alert.getType(),
                alert.getTargetId(),
                alert.getContent(),
                alert.getIsRead(),
                alert.getCreatedAt()
        );
    }
}
