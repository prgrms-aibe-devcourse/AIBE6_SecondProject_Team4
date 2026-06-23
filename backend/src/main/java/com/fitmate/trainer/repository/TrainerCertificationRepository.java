package com.fitmate.trainer.repository;

import com.fitmate.trainer.entity.TrainerCertification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerCertificationRepository extends JpaRepository<TrainerCertification, Long> {

    List<TrainerCertification> findByTrainerProfileIdOrderByAcquiredYearDesc(Long trainerProfileId);

    void deleteByTrainerProfileId(Long trainerProfileId);
}