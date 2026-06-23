package com.fitmate.workout.controller;

import com.fitmate.workout.dto.WorkoutLogRequest;
import com.fitmate.workout.dto.WorkoutLogResponse;
import com.fitmate.workout.service.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matching/{matchingId}/workout-logs")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    @GetMapping
    public ResponseEntity<List<WorkoutLogResponse>> getLogs(
            @PathVariable Long matchingId) {
        return ResponseEntity.ok(workoutLogService.getLogs(matchingId));
    }

    @PostMapping
    public ResponseEntity<WorkoutLogResponse> createLog(
            @PathVariable Long matchingId,
            @RequestBody WorkoutLogRequest request,
            Authentication authentication) {
        return ResponseEntity.status(201)
                .body(workoutLogService.createLog(matchingId, authentication.getName(), request));
    }

    @PatchMapping("/{logId}")
    public ResponseEntity<WorkoutLogResponse> updateLog(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            @RequestBody WorkoutLogRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.updateLog(matchingId, logId, authentication.getName(), request));
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            Authentication authentication) {
        workoutLogService.deleteLog(matchingId, logId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{logId}/complete")
    public ResponseEntity<WorkoutLogResponse> completeWorkout(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.completeWorkout(matchingId, logId, authentication.getName()));
    }

    @PostMapping("/{logId}/photos")
    public ResponseEntity<WorkoutLogResponse> addPhoto(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.addPhoto(matchingId, logId, authentication.getName(), body.get("photoUrl")));
    }

    @DeleteMapping("/{logId}/photos/{photoId}")
    public ResponseEntity<WorkoutLogResponse> deletePhoto(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            @PathVariable Long photoId,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.deletePhoto(matchingId, logId, photoId, authentication.getName()));
    }

    @PatchMapping("/{logId}/cancel-complete")
    public ResponseEntity<WorkoutLogResponse> cancelComplete(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.cancelComplete(matchingId, logId, authentication.getName()));
    }

    @PatchMapping("/{logId}/comment")
    public ResponseEntity<WorkoutLogResponse> updateComment(
            @PathVariable Long matchingId,
            @PathVariable Long logId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        return ResponseEntity.ok(
                workoutLogService.updateTrainerComment(matchingId, logId, authentication.getName(), body.get("comment")));
    }
}