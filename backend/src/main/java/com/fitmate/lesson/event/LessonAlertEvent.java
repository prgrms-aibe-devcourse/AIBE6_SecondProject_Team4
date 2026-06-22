package com.fitmate.lesson.event;

import com.fitmate.alert.entity.AlertType;

public record LessonAlertEvent(
        Long receiverId,
        AlertType type,
        Long lessonRequestId,
        String content
) {
}
