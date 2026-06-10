package com.fitmate.review.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matching_id", nullable = false, unique = true)
    private MatchingRequest matchingRequest;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, length = 500)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Member reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Member trainer;
}
