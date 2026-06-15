package com.fitmate.trainer.service;

import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final MemberRepository memberRepository;

    public TrainerProfileResponse getTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));
        return TrainerProfileResponse.from(profile);
    }

    public List<TrainerProfileResponse> getTrainerProfilesByFilter(
            String sport,
            String lessonType,
            Integer minPrice,
            Integer maxPrice,
            String region) {
        return trainerProfileRepository.findByFilters(sport, lessonType, minPrice, maxPrice, region)
                .stream()
                .map(TrainerProfileResponse::from)
                .toList();
    }

    public TrainerProfileResponse createTrainerProfile(Long memberId, TrainerProfileRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        if (trainerProfileRepository.findByMemberId(memberId).isPresent()) {
            throw new CustomException(ErrorCode.TRAINER_PROFILE_ALREADY_EXISTS);
        }

        TrainerProfile saved = trainerProfileRepository.save(request.toEntity(member));
        return TrainerProfileResponse.from(saved);
    }

    public TrainerProfileResponse updateTrainerProfile(Long id, Long memberId, TrainerProfileUpdateRequest request) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));

        if (!profile.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        profile.update(request);
        return TrainerProfileResponse.from(profile);
    }

    public void deleteTrainerProfile(Long id, Long memberId) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));

        if (!profile.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        trainerProfileRepository.delete(profile);
    }
}