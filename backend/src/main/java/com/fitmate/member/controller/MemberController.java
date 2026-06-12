package com.fitmate.member.controller;

import com.fitmate.member.dto.TrainerSummaryDto;
import com.fitmate.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerSummaryDto>> getTrainers() {
        return ResponseEntity.ok(memberService.getTrainers());
    }
}
