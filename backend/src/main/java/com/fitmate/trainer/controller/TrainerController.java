package com.fitmate.trainer.controller;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.service.TrainerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;
    private final MemberRepository memberRepository;


    @Transactional(readOnly = true)
    @GetMapping
    @Operation(summary = "트레이너 목록 조회 및 필터링")
    public ResponseEntity<List<TrainerProfileResponse>> getTrainerProfiles(
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String lessonType,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String region) {
        return ResponseEntity.ok(trainerService.getTrainerProfilesByFilter(sport, lessonType, minPrice, maxPrice, region));
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    @Operation(summary = "트레이너 프로필 상세 조회")
    public ResponseEntity<TrainerProfileResponse> getTrainerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerProfile(id));
    }

    @Transactional
    @PostMapping
    @Operation(summary = "트레이너 프로필 등록")
    public ResponseEntity<TrainerProfileResponse> createTrainerProfile(
            @RequestBody TrainerProfileRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        return ResponseEntity.status(201).body(trainerService.createTrainerProfile(member.getId(), request));
    }

    @Transactional
    @PutMapping("/{id}")
    @Operation(summary = "트레이너 프로필 수정")
    public ResponseEntity<TrainerProfileResponse> updateTrainerProfile(
            @PathVariable Long id,
            @RequestBody TrainerProfileUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        return ResponseEntity.ok(trainerService.updateTrainerProfile(id, member.getId(), request));
    }

    @Transactional
    @DeleteMapping("/{id}")
    @Operation(summary = "트레이너 프로필 삭제")
    public ResponseEntity<Void> deleteTrainerProfile(@PathVariable Long id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        trainerService.deleteTrainerProfile(id, member.getId());

        return ResponseEntity.noContent().build();
    }
}
