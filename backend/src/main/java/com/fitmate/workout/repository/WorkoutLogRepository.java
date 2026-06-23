package com.fitmate.workout.repository;

import com.fitmate.workout.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByMatchingResult_IdOrderByDateDesc(Long matchingId);

    Optional<WorkoutLog> findByMatchingResult_IdAndId(Long matchingId, Long logId);

    @Query("SELECT w.date FROM WorkoutLog w WHERE w.matchingResult.id IN :matchingIds AND w.completed = true")
    List<LocalDate> findCompletedDatesByMatchingIds(@Param("matchingIds") List<Long> matchingIds);

    @Query("SELECT w.date, w.matchingResult.id FROM WorkoutLog w WHERE w.matchingResult.id IN :matchingIds AND w.completed = true")
    List<Object[]> findCompletedDatesWithMatchingIdsByMatchingIds(@Param("matchingIds") List<Long> matchingIds);

    @Query("SELECT w.date, w.matchingResult.id, w.completed FROM WorkoutLog w WHERE w.matchingResult.id IN :matchingIds")
    List<Object[]> findAllDatesWithMatchingIdsByMatchingIds(@Param("matchingIds") List<Long> matchingIds);
}