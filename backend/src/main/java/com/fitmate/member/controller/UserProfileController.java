package com.fitmate.member.controller;

import com.fitmate.member.dto.UserProfileRequest;
import com.fitmate.member.dto.UserProfileResponse;
import com.fitmate.member.dto.UserProfileUpdateRequest;
import com.fitmate.member.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Transactional(readOnly = true)
    @GetMapping
    @Operation(summary = "사용자 프로필 목록 조회")
    public ResponseEntity<List<UserProfileResponse>> getUserProfiles() {
        return ResponseEntity.ok(userProfileService.getUserProfiles());
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    @Operation(summary = "사용자 프로필 상세 조회")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userProfileService.getUserProfile(id));
    }

    @Transactional
    @PostMapping
    @Operation(summary = "사용자 프로필 등록")
    public ResponseEntity<UserProfileResponse> createUserProfile(
            @RequestParam Long memberId,
            @RequestBody UserProfileRequest request) {
        return ResponseEntity.status(201).body(userProfileService.createUserProfile(memberId, request));
    }

    @Transactional
    @PutMapping("/{id}")
    @Operation(summary = "사용자 프로필 수정")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userProfileService.updateUserProfile(id, request));
    }

    @Transactional
    @DeleteMapping("/{id}")
    @Operation(summary = "사용자 프로필 삭제")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long id) {
        userProfileService.deleteUserProfile(id);
        return ResponseEntity.noContent().build();
    }
}