package com.fitmate.payment.controller;

import com.fitmate.payment.dto.PaymentConfirmRequest;
import com.fitmate.payment.dto.PaymentInfoResponse;
import com.fitmate.payment.dto.PaymentResponse;
import com.fitmate.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/prepare/{lessonRequestId}")
    public ResponseEntity<PaymentInfoResponse> prepare(
            @PathVariable Long lessonRequestId,
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(paymentService.prepare(lessonRequestId, userId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponse> confirm(
            @RequestBody PaymentConfirmRequest request,
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(paymentService.confirm(request, userId));
    }
}