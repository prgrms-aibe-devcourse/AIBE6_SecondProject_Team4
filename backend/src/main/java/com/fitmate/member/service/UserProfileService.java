package com.fitmate.member.service;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
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
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        return UserProfileResponse.from(profile);
    }

    public List<UserProfileResponse> getUserProfiles() {
        return userProfileRepository.findAll()
                .stream()
                .map(UserProfileResponse::from)
                .toList();
    }

    public UserProfileResponse createUserProfile(String userId, UserProfileRequest request) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        if (userProfileRepository.findByMemberId(member.getId()).isPresent()) {
            throw new CustomException(ErrorCode.USER_PROFILE_ALREADY_EXISTS);
        }

        UserProfile saved = userProfileRepository.save(request.toEntity(member));

        return UserProfileResponse.from(saved);
    }

    public UserProfileResponse updateUserProfile(Long id, String userId, UserProfileUpdateRequest request) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        profile.update(request);

        return UserProfileResponse.from(profile);
    }

    public void deleteUserProfile(Long id, String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        if (!profile.getMember().getId().equals(member.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        userProfileRepository.delete(profile);
    }

    public UserProfileResponse getMyUserProfile(String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));
        UserProfile profile = userProfileRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        return UserProfileResponse.from(profile);
    }
}