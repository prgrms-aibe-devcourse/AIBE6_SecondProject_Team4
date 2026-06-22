package com.fitmate.auth.service;

import com.fitmate.auth.entity.SmsVerification;
import com.fitmate.auth.repository.SmsVerificationRepository;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final SmsVerificationRepository smsVerificationRepository;

    @Value("${coolsms.api-key}")
    private String apiKey;

    @Value("${coolsms.api-secret}")
    private String apiSecret;

    @Value("${coolsms.from}")
    private String fromNumber;

    @Transactional
    public void sendVerificationCode(String phone) {
        // 기존 인증 정보 삭제
        smsVerificationRepository.deleteByPhone(phone);;

        // 6자리 인증번호 생성
        String code = String.format("%06d", new Random().nextInt(1000000));

        // DB에 저장 (5분 유효)
        smsVerificationRepository.save(
                SmsVerification.builder()
                        .phone(phone)
                        .code(code)
                        .expiresAt(LocalDateTime.now().plusMinutes(5))
                        .build()
        );

        // SMS 발송
        DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(
                apiKey, apiSecret, "https://api.coolsms.co.kr"
        );

        Message message = new Message();
        message.setFrom(fromNumber);
        message.setTo(phone.replaceAll("-", ""));
        message.setText("[FitMate] 인증번호: " + code + "\n5분 이내에 입력해 주세요.");

        messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    @Transactional
    public void verifyCode(String phone, String code) {
        SmsVerification verification = smsVerificationRepository
                .findTopByPhoneOrderByIdDesc(phone)
                .orElseThrow(() -> new CustomException(ErrorCode.SMS_NOT_FOUND));

        if (verification.isExpired()) {
            throw new CustomException(ErrorCode.SMS_EXPIRED);
        }

        if (!verification.getCode().equals(code)) {
            throw new CustomException(ErrorCode.SMS_INVALID_CODE);
        }

        verification.verify();
    }

    public boolean isVerified(String phone) {
        return smsVerificationRepository
                .findTopByPhoneOrderByIdDesc(phone)
                .map(v -> v.isVerified() && !v.isExpired())
                .orElse(false);
    }
}