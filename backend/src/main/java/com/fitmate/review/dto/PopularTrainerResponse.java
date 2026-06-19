package com.fitmate.review.dto;

/**
 * 인기 트레이너 (메인 페이지)
 * 후기 평점·개수 기반으로 정렬된 트레이너 요약 정보
 */
public record PopularTrainerResponse(
        Long trainerId,        // 트레이너 Member id
        Long trainerProfileId, // 트레이너 프로필 id (상세 페이지 이동용)
        String nickname,       // 트레이너 닉네임
        String profileImage,   // 프로필 사진
        String sports,         // 전문 종목
        String region,         // 활동 지역
        double averageRating,  // 평균 평점
        long reviewCount       // 후기 수
) {
}