package com.fitmate.inquiry.repository;

import com.fitmate.inquiry.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByMemberIdOrderByCreatedAtDesc(Long memberId);
}
