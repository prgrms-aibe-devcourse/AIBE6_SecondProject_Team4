package com.fitmate.alert.dto;

import com.fitmate.alert.entity.AlertType;

public record AlertRequest(
        Long receiverId,
        AlertType type,
        Long targetId,
        String content
) {}
