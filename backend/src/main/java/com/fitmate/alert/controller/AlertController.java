package com.fitmate.alert.controller;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.dto.AlertResponse;
import com.fitmate.alert.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "알림",
        description = "알림 관리 API"
)
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @Operation(summary = "알림 목록 조회", description = "로그인한 사용자의 알림 목록을 최신순으로 조회합니다.")
    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAlerts(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        return ResponseEntity.ok(alertService.getAlerts(memberId));
    }

    @Operation(summary = "알림 단일 읽음 처리", description = "특정 알림을 읽음 상태로 변경합니다.")
    @PatchMapping("/{alertId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long alertId) {
        alertService.markAsRead(alertId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "알림 일괄 읽음 처리", description = "로그인한 사용자의 모든 알림을 읽음 상태로 변경합니다.")
    @PatchMapping("/read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        alertService.markAllAsRead(memberId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "알림 일괄 삭제", description = "로그인한 사용자의 모든 알림을 삭제합니다.")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllAlerts(Authentication authentication) {
        Long memberId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        alertService.deleteAllAlerts(memberId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "알림 단일 삭제", description = "특정 알림을 삭제합니다.")
    @DeleteMapping("/{alertId}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long alertId) {
        alertService.deleteAlert(alertId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "알림 생성", description = "새로운 알림을 생성합니다.")
    @PostMapping
    public ResponseEntity<AlertResponse> createAlert(@RequestBody AlertRequest request) {
        return ResponseEntity.ok(alertService.createAlert(request));
    }
}
