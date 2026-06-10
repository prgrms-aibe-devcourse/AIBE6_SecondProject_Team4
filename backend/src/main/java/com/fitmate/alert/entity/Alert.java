package com.fitmate.alert.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alert")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Alert extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Member receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 100)
    private AlertType type;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(nullable = false, length = 200)
    private String content;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;
}
