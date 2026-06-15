package com.fitmate.alert.service;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.dto.AlertResponse;
import com.fitmate.alert.entity.Alert;
import com.fitmate.alert.repository.AlertRepository;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;
    private final MemberRepository memberRepository;

    public List<AlertResponse> getAlerts(Long memberId) {
        return alertRepository.findByReceiverIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(AlertResponse::from)
                .toList();
    }

    @Transactional
    public void deleteAlert(Long alertId) {
        if (!alertRepository.existsById(alertId)) {
            throw new CustomException(ErrorCode.ALERT_NOT_FOUND);
        }
        alertRepository.deleteById(alertId);
    }

    @Transactional
    public void markAllAsRead(Long memberId) {
        alertRepository.markAllAsRead(memberId);
    }

    @Transactional
    public void deleteAllAlerts(Long memberId) {
        alertRepository.deleteByReceiverId(memberId);
    }

    @Transactional
    public AlertResponse createAlert(AlertRequest request) {
        Member receiver = memberRepository.findById(request.receiverId())
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        Alert alert = Alert.builder()
                .receiver(receiver)
                .type(request.type())
                .targetId(request.targetId())
                .content(request.content())
                .isRead(false)
                .build();

        return AlertResponse.from(alertRepository.save(alert));
    }
}
