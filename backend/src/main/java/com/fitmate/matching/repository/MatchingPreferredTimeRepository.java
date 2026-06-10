package com.fitmate.matching.repository;

import com.fitmate.matching.entity.MatchingPreferredTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchingPreferredTimeRepository extends JpaRepository<MatchingPreferredTime, Long> {
    List<MatchingPreferredTime> findByMatchingRequestId(Long matchingRequestId);
}
