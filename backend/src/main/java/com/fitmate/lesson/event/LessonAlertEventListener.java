package com.fitmate.lesson.event;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class LessonAlertEventListener {

    private final AlertService alertService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void createLessonAlert(LessonAlertEvent event) {
        try {
            alertService.createAlert(new AlertRequest(
                    event.receiverId(),
                    event.type(),
                    event.lessonRequestId(),
                    event.content()
            ));
        } catch (Exception exception) {
            log.warn(
                    "레슨 알림 생성 실패: receiverId={}, lessonRequestId={}, type={}",
                    event.receiverId(),
                    event.lessonRequestId(),
                    event.type(),
                    exception
            );
        }
    }
}
