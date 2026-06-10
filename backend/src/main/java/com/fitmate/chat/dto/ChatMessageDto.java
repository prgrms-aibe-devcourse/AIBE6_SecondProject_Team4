package com.fitmate.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChatMessageDto(
        @NotNull Long chatRoomId,
        @NotNull Long senderId,
        @NotBlank String message
) {}
