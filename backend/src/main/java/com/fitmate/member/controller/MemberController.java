package com.fitmate.member.controller;

import com.fitmate.member.dto.TrainerSummaryDto;
import com.fitmate.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.fitmate.member.dto.MemberResponse;
import com.fitmate.member.dto.MemberUpdateRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import jakarta.validation.Valid;

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

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerSummaryDto>> getTrainers() {
        return ResponseEntity.ok(memberService.getTrainers());
    }
}
