package com.fitmate.matching.repository;

import com.fitmate.matching.entity.MatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchingResultRepository extends JpaRepository<MatchingResult, Long> {
    List<MatchingResult> findByMatchingRequestId(Long matchingRequestId);
}
