package com.fitmate.trainer.controller;

import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.service.TrainerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @Transactional(readOnly = true)
    @GetMapping
    @Operation(summary = "트레이너 목록 조회")
    public ResponseEntity<List<TrainerProfileResponse>> getTrainerProfiles() {
        return ResponseEntity.ok(trainerService.getTrainerProfiles());
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
            @RequestParam Long memberId,
            @RequestBody TrainerProfileRequest request) {
        return ResponseEntity.status(201).body(trainerService.createTrainerProfile(memberId, request));
    }

    @Transactional
    @PutMapping("/{id}")
    @Operation(summary = "트레이너 프로필 수정")
    public ResponseEntity<TrainerProfileResponse> updateTrainerProfile(
            @PathVariable Long id,
            @RequestBody TrainerProfileUpdateRequest request) {
        return ResponseEntity.ok(trainerService.updateTrainerProfile(id, request));
    }

    @Transactional
    @DeleteMapping("/{id}")
    @Operation(summary = "트레이너 프로필 삭제")
    public ResponseEntity<Void> deleteTrainerProfile(@PathVariable Long id) {
        trainerService.deleteTrainerProfile(id);
        return ResponseEntity.noContent().build();
    }
}
