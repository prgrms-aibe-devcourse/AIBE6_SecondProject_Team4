package com.fitmate.payment.service;

import com.fitmate.alert.entity.AlertType;
import com.fitmate.lesson.event.LessonAlertEvent;
import com.fitmate.lesson.entity.LessonRequest;
import com.fitmate.lesson.entity.LessonPassType;
import com.fitmate.lesson.entity.LessonRequestStatus;
import com.fitmate.lesson.repository.LessonRequestRepository;
import com.fitmate.payment.dto.PaymentConfirmRequest;
import com.fitmate.payment.dto.PaymentInfoResponse;
import com.fitmate.payment.dto.PaymentResponse;
import com.fitmate.payment.entity.Payment;
import com.fitmate.payment.entity.PaymentStatus;
import com.fitmate.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;


import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final LessonRequestRepository lessonRequestRepository;
    private final MemberRepository memberRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    // ── 1. 결제 정보 조회 + 결제 준비 (orderId 발급, payments READY 생성) ──
    @Transactional
    public PaymentInfoResponse prepare(Long lessonRequestId, String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        LessonRequest lesson = lessonRequestRepository.findById(lessonRequestId)
                .orElseThrow(() -> new IllegalArgumentException("레슨 요청을 찾을 수 없습니다."));

        // 본인 요청인지 검증
        if (!lesson.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 레슨 요청만 결제할 수 있습니다.");
        }
        if (lesson.getStatus() != LessonRequestStatus.ACCEPTED) {
            throw new IllegalStateException("수락된 레슨만 결제할 수 있습니다.");
        }
        if (paymentRepository.existsByLessonRequestIdAndStatus(lessonRequestId, PaymentStatus.PAID)) {
            throw new IllegalStateException("이미 결제가 완료된 레슨입니다.");
        }
        // 기존 미완료(READY) 결제 삭제 → 재시도 시 중복 생성 방지
        paymentRepository.deleteByLessonRequestIdAndStatus(lessonRequestId, PaymentStatus.READY);

        int amount = calculateAmount(lesson);
        String orderId = "ORDER_" + UUID.randomUUID().toString().replace("-", "");
        String trainerNickname = lesson.getTrainerProfile().getMember().getNickname();
        String sports = lesson.getTrainerProfile().getSports();
        String passName = lesson.getLessonPassType() == LessonPassType.PACKAGE
                ? lesson.getPackageCount() + "회권"
                : "1회권";
        String orderName = trainerNickname + " - " + sports + " " + passName;

        Payment payment = Payment.builder()
                .lessonRequest(lesson)
                .amount(amount)
                .orderId(orderId)
                .status(PaymentStatus.READY)
                .build();
        paymentRepository.save(payment);

        return new PaymentInfoResponse(
                lessonRequestId, trainerNickname, sports,
                lesson.getLessonPassType().name(), lesson.getPackageCount(),
                lesson.getTrainerProfile().getPrice(), amount, orderId, orderName
        );
    }

    // ── 2. 결제 승인 (토스 검증 + payments PAID) ──
    @Transactional
    public PaymentResponse confirm(PaymentConfirmRequest request, String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Payment payment = paymentRepository.findByOrderId(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보를 찾을 수 없습니다."));

        if (!payment.getLessonRequest().getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("본인의 결제만 승인할 수 있습니다.");
        }
        if (!payment.getAmount().equals(request.amount())) {
            throw new IllegalStateException("결제 금액이 일치하지 않습니다.");
        }

        // 토스 결제 승인 API 호출
        String authHeader = "Basic " + Base64.getEncoder()
                .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

        RestClient restClient = RestClient.create();
        try {
            Map<String, Object> response = restClient.post()
                    .uri(TOSS_CONFIRM_URL)
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "paymentKey", request.paymentKey(),
                            "orderId", request.orderId(),
                            "amount", request.amount()
                    ))
                    .retrieve()
                    .body(Map.class);

            // 승인 성공 → payments PAID
            String method = response != null ? (String) response.get("method") : null;
            payment.complete(request.paymentKey(), method);
            payment.getLessonRequest().complete();

            LessonRequest completedLesson = payment.getLessonRequest();
            Member lessonMember = completedLesson.getMember();
            Member trainerMember = completedLesson.getTrainerProfile().getMember();

            eventPublisher.publishEvent(new LessonAlertEvent(
                    lessonMember.getId(),
                    AlertType.MATCHING_COMPLETED,
                    completedLesson.getId(),
                    trainerMember.getNickname() + " 트레이너와의 레슨 매칭이 완료되었습니다."
            ));
            eventPublisher.publishEvent(new LessonAlertEvent(
                    trainerMember.getId(),
                    AlertType.MATCHING_COMPLETED,
                    completedLesson.getId(),
                    lessonMember.getNickname() + "님과의 레슨 매칭이 완료되었습니다."
            ));
            eventPublisher.publishEvent(new LessonAlertEvent(
                    lessonMember.getId(),
                    AlertType.REVIEW,
                    completedLesson.getId(),
                    trainerMember.getNickname() + " 트레이너에 대한 후기를 작성해보세요!"
            ));

            return PaymentResponse.from(payment);

        } catch (Exception e) {
            payment.fail();
            throw new IllegalStateException("결제 승인에 실패했습니다: " + e.getMessage());
        }
    }

    // ── 금액 계산: 1회권 = 단가, 패키지권 = 단가 × 패키지 횟수 ──
    private int calculateAmount(LessonRequest lesson) {
        int price = lesson.getTrainerProfile().getPrice();
        if (lesson.getLessonPassType() == LessonPassType.PACKAGE
                && lesson.getPackageCount() != null) {
            int total = price * lesson.getPackageCount();
            double discountRate = switch (lesson.getPackageCount()) {
                case 5 -> 0.05;
                case 10 -> 0.10;
                case 20 -> 0.20;
                default -> 0.0;
            };
            return (int) Math.round(total * (1 - discountRate));
        }
        return price; // ONE_TIME
    }
}
