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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;
    private final MemberRepository memberRepository;

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
