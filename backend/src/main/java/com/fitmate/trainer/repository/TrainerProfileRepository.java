package com.fitmate.trainer.repository;

import com.fitmate.trainer.entity.TrainerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    Optional<TrainerProfile> findByMemberId(Long memberId);

    @Query("SELECT t FROM TrainerProfile t JOIN t.member m WHERE " +
            "t.isPublic = true AND " +
            "(:sport IS NULL OR t.sports LIKE %:sport%) AND " +
            "(:lessonType IS NULL OR t.lessonType = :lessonType) AND " +
            "(:lessonLevel IS NULL OR t.lessonLevel LIKE %:lessonLevel%) AND " +
            "(:minPrice IS NULL OR t.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR t.price <= :maxPrice) AND " +
            "(:region IS NULL OR m.region LIKE %:region%)")
    Page<TrainerProfile> findByFilters(
            @Param("sport") String sport,
            @Param("lessonType") String lessonType,
            @Param("lessonLevel") String lessonLevel,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("region") String region,
            Pageable pageable
    );
}