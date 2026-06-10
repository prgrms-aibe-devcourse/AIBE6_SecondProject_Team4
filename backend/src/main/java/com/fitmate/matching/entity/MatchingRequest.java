package com.fitmate.matching.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matching_request")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MatchingRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 50)
    private String level;

    @Column(nullable = false, length = 255)
    private String sports;

    @Column(name = "lesson_type", nullable = false, length = 50)
    private String lessonType;

    @Column(nullable = false, length = 255)
    private String region;

    @Column(name = "budget_min", nullable = false)
    private Integer budgetMin;

    @Column(name = "budget_max", nullable = false)
    private Integer budgetMax;
}
