package com.fitmate.trainer.repository;

import com.fitmate.trainer.entity.TrainerAvailableTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerAvailableTimeRepository extends JpaRepository<TrainerAvailableTime, Long> {
    List<TrainerAvailableTime> findByTrainerProfileId(Long trainerProfileId);

    void deleteByTrainerProfileId(Long trainerProfileId);
}
