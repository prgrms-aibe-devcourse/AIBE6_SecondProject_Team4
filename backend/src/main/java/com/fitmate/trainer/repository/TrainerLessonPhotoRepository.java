package com.fitmate.trainer.repository;

import com.fitmate.trainer.entity.TrainerLessonPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerLessonPhotoRepository extends JpaRepository<TrainerLessonPhoto, Long> {
    List<TrainerLessonPhoto> findByTrainerProfileId(Long trainerProfileId);
    void deleteByTrainerProfileId(Long trainerProfileId);
}