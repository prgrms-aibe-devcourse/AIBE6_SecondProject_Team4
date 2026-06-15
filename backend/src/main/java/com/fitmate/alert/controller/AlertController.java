package com.fitmate.alert.controller;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.dto.AlertResponse;
import com.fitmate.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAlerts(@RequestParam Long memberId) {
        return ResponseEntity.ok(alertService.getAlerts(memberId));
    }

    @PostMapping
    public ResponseEntity<AlertResponse> createAlert(@RequestBody AlertRequest request) {
        return ResponseEntity.ok(alertService.createAlert(request));
    }
}
