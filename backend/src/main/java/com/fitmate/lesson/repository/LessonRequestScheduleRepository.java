package com.fitmate.lesson.repository;

import com.fitmate.lesson.entity.LessonRequestSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRequestScheduleRepository
        extends JpaRepository<LessonRequestSchedule, Long> {

    List<LessonRequestSchedule>
    findByLessonRequestIdOrderByRequestedDateAscStartTimeAsc(Long lessonRequestId);
}
