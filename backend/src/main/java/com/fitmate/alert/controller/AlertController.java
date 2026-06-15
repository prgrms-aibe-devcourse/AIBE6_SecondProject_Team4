package com.fitmate.alert.controller;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.dto.AlertResponse;
import com.fitmate.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAlerts(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(alertService.getAlerts(memberId));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllAlerts(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        alertService.deleteAllAlerts(memberId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long alertId) {
        alertService.deleteAlert(alertId);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<AlertResponse> createAlert(@RequestBody AlertRequest request) {
        return ResponseEntity.ok(alertService.createAlert(request));
    }
}
