package com.fitmate.trainer.service;

import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.trainer.dto.TrainerProfileRequest;
import com.fitmate.trainer.dto.TrainerProfileResponse;
import com.fitmate.trainer.dto.TrainerProfileUpdateRequest;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrainerService {

    private final TrainerProfileRepository trainerProfileRepository;
    private final MemberRepository memberRepository;

    public TrainerProfileResponse getTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다."));
        return TrainerProfileResponse.from(profile);
    }

    public List<TrainerProfileResponse> getTrainerProfiles() {
        return trainerProfileRepository.findAll()
                .stream()
                .map(TrainerProfileResponse::from)
                .toList();
    }

    public TrainerProfileResponse createTrainerProfile(Long memberId, TrainerProfileRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        TrainerProfile saved = trainerProfileRepository.save(request.toEntity(member));
        return TrainerProfileResponse.from(saved);
    }

    public TrainerProfileResponse updateTrainerProfile(Long id, TrainerProfileUpdateRequest request) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다."));
        profile.update(request);
        return TrainerProfileResponse.from(profile);
    }

    public void deleteTrainerProfile(Long id) {
        TrainerProfile profile = trainerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("트레이너를 찾을 수 없습니다."));
        trainerProfileRepository.delete(profile);
    }
}
