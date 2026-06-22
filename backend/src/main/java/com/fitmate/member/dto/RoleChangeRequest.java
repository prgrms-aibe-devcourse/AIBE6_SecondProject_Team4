package com.fitmate.member.dto;

import jakarta.validation.constraints.NotNull;

public record RoleChangeRequest(
        @NotNull
        Role role
) {
    public enum Role {
        USER, TRAINER
    }
}