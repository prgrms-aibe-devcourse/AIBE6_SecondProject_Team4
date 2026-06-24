package com.fitmate.workout.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "workout_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WorkoutLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id", nullable = false)
    private MatchingResult matchingResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Member trainer;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String routine;

    @Column(columnDefinition = "TEXT")
    private String diet;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    @Column(columnDefinition = "TEXT")
    private String trainerComment;

    public void updateTrainerComment(String comment) {
        this.trainerComment = comment;
    }

    public void complete() {
        this.completed = true;
    }

    public void cancelComplete() {
        this.completed = false;
    }

    public void update(String routine, String diet, String memo) {
        this.routine = routine;
        this.diet = diet;
        this.memo = memo;
    }
}