package com.fitmate.matching.service;

import com.fitmate.matching.repository.MatchingRequestRepository;
import com.fitmate.matching.repository.MatchingResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchingService {

    private final MatchingRequestRepository matchingRequestRepository;
    private final MatchingResultRepository matchingResultRepository;
}
