package com.fitmate.chat.dto;

import jakarta.validation.constraints.NotNull;

public record ChatRoomRequest(
        @NotNull Long trainerId,
        @NotNull Long userId
) {}
