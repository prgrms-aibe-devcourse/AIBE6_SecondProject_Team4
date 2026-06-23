package com.fitmate.workout.repository;

import com.fitmate.workout.entity.WorkoutPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutPhotoRepository extends JpaRepository<WorkoutPhoto, Long> {
    List<WorkoutPhoto> findByWorkoutLog_Id(Long workoutLogId);
    void deleteByWorkoutLog_Id(Long workoutLogId);
}