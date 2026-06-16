package com.fitmate.member.controller;

import com.fitmate.member.dto.MemberResponse;
import com.fitmate.member.dto.MemberUpdateRequest;
import com.fitmate.member.dto.TrainerSummaryDto;
import com.fitmate.member.dto.PasswordChangeRequest;
import com.fitmate.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public MemberResponse getMyInfo(Authentication authentication) {
        String userId = authentication.getName();
        return memberService.getMyInfo(userId);
    }

    @PatchMapping("/me")
    public MemberResponse updateMyInfo(Authentication authentication,
                                       @Valid @RequestBody MemberUpdateRequest request) {
        String userId = authentication.getName();
        return memberService.updateMyInfo(userId, request);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(Authentication authentication) {
        String userId = authentication.getName();
        memberService.deleteMyAccount(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(Authentication authentication,
                                               @Valid @RequestBody PasswordChangeRequest request) {
        String userId = authentication.getName();
        memberService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerSummaryDto>> getTrainers() {
        return ResponseEntity.ok(memberService.getTrainers());
    }
}
