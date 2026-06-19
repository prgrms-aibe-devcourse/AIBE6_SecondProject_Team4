package com.fitmate.review.repository;

import com.fitmate.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTrainerId(Long trainerId);

    Optional<Review> findByMatchingRequestId(Long matchingRequestId);

    // 트레이너별 평균 평점
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.trainer.id = :trainerId")
    Double findAverageRatingByTrainerId(Long trainerId);

    // 트레이너별 별점 분포
    @Query("""
            SELECT r.rating, COUNT(r)
            FROM Review r
            WHERE r.trainer.id = :trainerId
            GROUP BY r.rating
            """)
    List<Object[]> countRatingDistributionByTrainerId(Long trainerId);

    // 트레이너별 후기 개수
    long countByTrainerId(Long trainerId);

    List<Review> findByReviewerId(Long reviewerId);

    Page<Review> findByReviewerId(Long reviewerId, Pageable pageable);

    Page<Review> findByTrainerId(Long trainerId, Pageable pageable);

    // AI 추천 사유 생성에 사용할 최근 리뷰 3개
    List<Review> findTop3ByTrainerIdOrderByCreatedAtDesc(Long trainerId);

    // ── 리얼 후기 (메인 페이지) ──────────────────────────────
    // 별점 4점 이상 + 내용 15자 이상인 후기를 최신순으로 (대표 후기)
    @Query("SELECT r FROM Review r " +
            "WHERE r.rating >= 4 AND LENGTH(r.content) >= 15 " +
            "ORDER BY r.createdAt DESC")
    List<Review> findRealReviews(Pageable pageable);

    // ── 인기 트레이너 (메인 페이지) ──────────────────────────
    // 후기가 있는 트레이너를 평균 평점 높은 순 → 후기 많은 순으로 집계
    // 반환: [trainerId(Long), avgRating(Double), reviewCount(Long)]
    @Query("SELECT r.trainer.id, AVG(r.rating), COUNT(r) " +
            "FROM Review r " +
            "GROUP BY r.trainer.id " +
            "ORDER BY AVG(r.rating) DESC, COUNT(r) DESC")
    List<Object[]> findPopularTrainers(Pageable pageable);

    // 여러 트레이너의 평균 평점/후기수를 한 번에 조회 (목록 페이지 N+1 방지)
// 반환: [trainerId(Long), avgRating(Double), reviewCount(Long)]
    @Query("SELECT r.trainer.id, AVG(r.rating), COUNT(r) " +
            "FROM Review r " +
            "WHERE r.trainer.id IN :trainerIds " +
            "GROUP BY r.trainer.id")
    List<Object[]> findRatingStatsByTrainerIds(@Param("trainerIds") List<Long> trainerIds);
}