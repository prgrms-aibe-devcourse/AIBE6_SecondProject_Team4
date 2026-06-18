package com.fitmate.matching.repository;

import com.fitmate.matching.entity.MatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MatchingResultRepository
        extends JpaRepository<MatchingResult, Long> {

    List<MatchingResult> findByMatchingRequestId(Long matchingRequestId);

    // 특정 트레이너 가능 시간을 참조하는 매칭 결과 목록 조회
    List<MatchingResult> findByTrainerAvailableTime_Id(
            Long trainerAvailableTimeId
    );
}
