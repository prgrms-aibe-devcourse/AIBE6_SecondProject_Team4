package com.fitmate.matching.repository;

import com.fitmate.matching.entity.MatchingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchingRequestRepository extends JpaRepository<MatchingRequest, Long> {
    List<MatchingRequest> findByMemberId(Long memberId);
}
