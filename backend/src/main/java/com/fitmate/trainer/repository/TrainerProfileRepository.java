package com.fitmate.trainer.repository;

import com.fitmate.trainer.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    Optional<TrainerProfile> findByMemberId(Long memberId);
}
