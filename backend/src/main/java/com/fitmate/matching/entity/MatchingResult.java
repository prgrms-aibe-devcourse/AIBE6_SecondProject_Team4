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

    // Gemini가 정한 추천 순위
    @Column(name = "ai_rank")
    private Integer aiRank;

    // Gemini가 생성한 추천 사유
    @Column(name = "ai_reason", length = 500)
    private String aiReason;

    // Gemini의 추천 결과를 기존 매칭 결과에 반영
    public void applyAiRecommendation(
            Integer aiRank,
            String aiReason
    ) {
        this.aiRank = aiRank;
        this.aiReason = aiReason;
    }
}