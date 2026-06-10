package com.fitmate.trainer.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainer_profiles")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TrainerProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Column(length = 255)
    private String sports;

    @Column(name = "lesson_type", length = 50)
    private String lessonType;

    private Integer price;
}
