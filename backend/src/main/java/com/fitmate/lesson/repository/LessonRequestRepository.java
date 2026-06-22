package com.fitmate.lesson.repository;

import com.fitmate.lesson.entity.LessonRequest;
import com.fitmate.lesson.entity.LessonRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

//lesson_requests 테이블을 DB에서 조회/저장/삭제
public interface LessonRequestRepository extends JpaRepository<LessonRequest, Long> {

    Optional<LessonRequest> findByMatchingResultId(Long matchingResultId);

    //중복 요청 방지용
    boolean existsByMatchingResultId(Long matchingResultId);

    //중복 요청 방지용 (트레이너 직접 선택 경로) - 같은 회원이 같은 트레이너에게 보낸 대기중 요청이 있는지
    boolean existsByMemberIdAndTrainerProfileIdAndStatus(
            Long memberId, Long trainerProfileId, LessonRequestStatus status
    );

    //트레이너가 받은 요청서 목록 조회용
    List<LessonRequest> findByTrainerProfileMemberUserIdOrderByCreatedAtDesc(String userId);

    //사용자가 보낸 요청서 목록 조회용
    List<LessonRequest> findByMemberUserIdOrderByCreatedAtDesc(String userId);

    //특정 트레이너의 특정 날짜에 확정(ACCEPTED)된 레슨 시간대 조회용 - 시간 슬롯 중복 방지
    List<LessonRequest> findByTrainerProfileIdAndRequestedDateAndStatus(
            Long trainerProfileId, LocalDate requestedDate, LessonRequestStatus status
    );
}