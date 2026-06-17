package com.fitmate.trainer.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.entity.Member;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainer_profiles")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TrainerProfile extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Column(length = 255)
    private String sports;

    @Column(name = "lesson_type", length = 50)
    private String lessonType;

    @Column(name = "lesson_level", length = 100)
    private String lessonLevel;

    private Integer price;

    private Integer careerYears;

    public void update(TrainerProfileUpdateRequest request) {
        if (request.sports() != null) this.sports = request.sports();
        if (request.lessonType() != null) this.lessonType = request.lessonType();
        if (request.price() != null) this.price = request.price();
        if (request.careerYears() != null) this.careerYears = request.careerYears();
        if (request.lessonLevel() != null) this.lessonLevel = request.lessonLevel();
    }
}
