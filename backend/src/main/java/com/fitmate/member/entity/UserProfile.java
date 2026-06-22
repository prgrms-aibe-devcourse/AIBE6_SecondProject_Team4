package com.fitmate.member.entity;

import com.fitmate.global.entity.BaseEntity;
import com.fitmate.member.dto.UserProfileUpdateRequest;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserProfile extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Column(length = 255)
    private String sports;

    @Column(nullable = false, length = 50)
    private String level;

    @Column(length = 50)
    private String goal;

    public void update(UserProfileUpdateRequest request) {
        if (request.sports() != null) this.sports = request.sports();
        if (request.level() != null) this.level = request.level();
        if (request.goal() != null) this.goal = request.goal();
    }
}
