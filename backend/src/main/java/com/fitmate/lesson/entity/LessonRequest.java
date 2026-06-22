package com.fitmate.lesson.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.member.entity.Member;
import com.fitmate.trainer.entity.TrainerProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "lesson_requests")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class LessonRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_result_id")
    private MatchingResult matchingResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_profile_id", nullable = false)
    private TrainerProfile trainerProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "lesson_pass_type", nullable = false, length = 30)
    private LessonPassType lessonPassType;

    @Column(name = "weekly_count")
    private Integer weeklyCount;

    @Column(name = "selected_sports", length = 255)
    private String selectedSports;

    @Column(name = "selected_lesson_level", length = 50)
    private String selectedLessonLevel;

    @Column(name = "selected_lesson_type", length = 50)
    private String selectedLessonType;

    // 기존 결제 및 상세 화면 호환을 위해 첫 번째 일정을 함께 저장합니다.
    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @Column(name = "requested_start_time", nullable = false)
    private LocalTime requestedStartTime;

    @Column(name = "requested_end_time", nullable = false)
    private LocalTime requestedEndTime;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LessonRequestStatus status;

    public void accept() {
        this.status = LessonRequestStatus.ACCEPTED;
    }

    public void reject() {
        this.status = LessonRequestStatus.REJECTED;
    }

    public void cancel() {
        this.status = LessonRequestStatus.CANCELED;
    }

    public void complete() {
        this.status = LessonRequestStatus.COMPLETED;
    }
}