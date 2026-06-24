package com.fitmate.workout.controller;

import com.fitmate.workout.service.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workout")
@RequiredArgsConstructor
public class WorkoutStatsController {

    private final WorkoutLogService workoutLogService;

    @GetMapping("/completed-dates")
    public ResponseEntity<List<Map<String, Object>>> getCompletedDates(
            @RequestParam List<Long> matchingIds,
            Authentication authentication) {
        return ResponseEntity.ok(workoutLogService.getCompletedDates(matchingIds));
    }

    @GetMapping("/all-dates")
    public ResponseEntity<List<Map<String, Object>>> getAllDates(
            @RequestParam List<Long> matchingIds,
            Authentication authentication) {
        return ResponseEntity.ok(workoutLogService.getAllDates(matchingIds));
    }
}