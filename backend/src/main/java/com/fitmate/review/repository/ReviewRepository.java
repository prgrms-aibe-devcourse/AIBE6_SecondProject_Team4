package com.fitmate.review.repository;

import com.fitmate.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTrainerId(Long trainerId);
    Optional<Review> findByMatchingRequestId(Long matchingRequestId);

    // 트레이너별 평균 평점
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.trainer.id = :trainerId")
    Double findAverageRatingByTrainerId(Long trainerId);

    // ReviewRepository에 추가
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.trainer.id = :trainerId GROUP BY r.rating")
    List<Object[]> countRatingDistributionByTrainerId(Long trainerId);

    // 트레이너별 후기 개수
    long countByTrainerId(Long trainerId);

    // ReviewRepository에 추가
    List<Review> findByReviewerId(Long reviewerId);

}
