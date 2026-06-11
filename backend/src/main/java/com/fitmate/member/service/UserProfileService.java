package com.fitmate.member.service;

import com.fitmate.member.dto.UserProfileRequest;
import com.fitmate.member.dto.UserProfileResponse;
import com.fitmate.member.dto.UserProfileUpdateRequest;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.UserProfile;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.member.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final MemberRepository memberRepository;

    public UserProfileResponse getUserProfile(Long id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return UserProfileResponse.from(profile);
    }

    public List<UserProfileResponse> getUserProfiles() {
        return userProfileRepository.findAll()
                .stream()
                .map(UserProfileResponse::from)
                .toList();
    }

    public UserProfileResponse createUserProfile(Long memberId, UserProfileRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        UserProfile saved = userProfileRepository.save(request.toEntity(member));
        return UserProfileResponse.from(saved);
    }

    public UserProfileResponse updateUserProfile(Long id, UserProfileUpdateRequest request) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        profile.update(request);
        return UserProfileResponse.from(profile);
    }

    public void deleteUserProfile(Long id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        userProfileRepository.delete(profile);
    }
}