package com.fitmate.lesson.repository;

import com.fitmate.lesson.entity.LessonRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//lesson_requests 테이블을 DB에서 조회/저장/삭제
public interface LessonRequestRepository extends JpaRepository<LessonRequest, Long> {

    Optional<LessonRequest> findByMatchingResultId(Long matchingResultId);

    //중복 요청 방지용
    boolean existsByMatchingResultId(Long matchingResultId);
    //트레이너가 받은 요청서 목록 조회용
    List<LessonRequest> findByTrainerProfileMemberUserIdOrderByCreatedAtDesc(String userId);
    //사용자가 보낸 요청서 목록 조회용
    List<LessonRequest> findByMemberUserIdOrderByCreatedAtDesc(String userId);
}