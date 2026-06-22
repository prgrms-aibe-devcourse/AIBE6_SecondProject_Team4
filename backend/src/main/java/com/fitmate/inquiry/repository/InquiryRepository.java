package com.fitmate.inquiry.repository;

import com.fitmate.inquiry.entity.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    Page<Inquiry> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);
    Page<Inquiry> findAllByOrderByCreatedAtAsc(Pageable pageable);
}
