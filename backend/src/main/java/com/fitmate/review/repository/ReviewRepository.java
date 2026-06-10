package com.fitmate.review.repository;

import com.fitmate.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTrainerId(Long trainerId);
    Optional<Review> findByMatchingRequestId(Long matchingRequestId);
}
