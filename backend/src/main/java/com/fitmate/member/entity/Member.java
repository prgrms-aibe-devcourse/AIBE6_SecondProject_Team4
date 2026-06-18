package com.fitmate.member.entity;

import java.time.LocalDateTime;
import com.fitmate.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "members")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Member extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 100, unique = true)
    private String userId;

    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(length = 255, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(length = 255)
    private String region;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void updateProfile(String nickname, String profileImage, String region, String introduction, String phone, String email) {
        if (nickname != null) this.nickname = nickname;
        if (profileImage != null) this.profileImage = profileImage;
        if (region != null) this.region = region;
        if (introduction != null) this.introduction = introduction;
        if (phone != null) this.phone = phone;
        if (email != null) this.email = email;
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}
