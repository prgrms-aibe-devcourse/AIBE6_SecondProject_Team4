package com.fitmate.trainer.entity;

import com.fitmate.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trainer_certifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TrainerCertification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_profile_id", nullable = false)
    private TrainerProfile trainerProfile;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "acquired_year")
    private Integer acquiredYear;

    @Column(nullable = false, length = 20)
    private String type;

    @Builder
    public TrainerCertification(TrainerProfile trainerProfile, String name, Integer acquiredYear, String type) {
        this.trainerProfile = trainerProfile;
        this.name = name;
        this.acquiredYear = acquiredYear;
        this.type = type;
    }
}