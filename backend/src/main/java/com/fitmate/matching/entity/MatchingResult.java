package com.fitmate.matching.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matching_results")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MatchingResult extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id", nullable = false)
    private MatchingRequest matchingRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_profile_id", nullable = false)
    private TrainerProfile trainerProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_time_id", nullable = false)
    private MatchingPreferredTime preferredTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_available_time_id", nullable = false)
    private TrainerAvailableTime trainerAvailableTime;
}
