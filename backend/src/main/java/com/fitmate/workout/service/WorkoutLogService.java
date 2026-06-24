package com.fitmate.workout.service;

import com.fitmate.alert.dto.AlertRequest;
import com.fitmate.alert.entity.AlertType;
import com.fitmate.alert.service.AlertService;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.matching.repository.MatchingResultRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.workout.dto.WorkoutLogRequest;
import com.fitmate.workout.dto.WorkoutLogResponse;
import com.fitmate.workout.dto.WorkoutPhotoResponse;
import com.fitmate.workout.entity.WorkoutLog;
import com.fitmate.workout.entity.WorkoutPhoto;
import com.fitmate.workout.repository.WorkoutLogRepository;
import com.fitmate.workout.repository.WorkoutPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final MatchingResultRepository matchingResultRepository;
    private final MemberRepository memberRepository;
    private final WorkoutPhotoRepository workoutPhotoRepository;
    private final AlertService alertService;

    private WorkoutLogResponse toResponse(WorkoutLog log) {
        List<WorkoutPhotoResponse> photos = workoutPhotoRepository.findByWorkoutLog_Id(log.getId())
                .stream().map(WorkoutPhotoResponse::from).toList();
        return WorkoutLogResponse.from(log, photos);
    }

    public List<WorkoutLogResponse> getLogs(Long matchingId) {
        return workoutLogRepository.findByMatchingResult_IdOrderByDateDesc(matchingId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public WorkoutLogResponse createLog(Long matchingId, String userId, WorkoutLogRequest request) {
        MatchingResult matching = matchingResultRepository.findById(matchingId)
                .orElseThrow(() -> new CustomException(ErrorCode.MATCHING_RESULT_NOT_FOUND));

        Member trainer = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        WorkoutLog log = WorkoutLog.builder()
                .matchingResult(matching)
                .trainer(trainer)
                .date(LocalDate.parse(request.date()))
                .routine(request.routine())
                .diet(request.diet())
                .memo(request.memo())
                .build();

        WorkoutLogResponse response = toResponse(workoutLogRepository.save(log));

        Member member = matching.getMatchingRequest().getMember();
        alertService.createAlert(new AlertRequest(
                member.getId(),
                AlertType.WORKOUT_LOG,
                matching.getId(),
                trainer.getNickname() + " 트레이너가 " + request.date() + " 일정을 추가했습니다."
        ));

        return response;
    }

    @Transactional
    public WorkoutLogResponse updateLog(Long matchingId, Long logId, String userId, WorkoutLogRequest request) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));

        if (!log.getTrainer().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        log.update(request.routine(), request.diet(), request.memo());
        return toResponse(log);
    }

    @Transactional
    public void deleteLog(Long matchingId, Long logId, String userId) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));

        if (!log.getTrainer().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        workoutPhotoRepository.deleteByWorkoutLog_Id(logId);
        workoutLogRepository.delete(log);
    }

    @Transactional
    public WorkoutLogResponse completeWorkout(Long matchingId, Long logId, String userId) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));
        log.complete();

        Member member = log.getMatchingResult().getMatchingRequest().getMember();
        Member trainer = log.getTrainer();
        alertService.createAlert(new AlertRequest(
                trainer.getId(),
                AlertType.WORKOUT_LOG,
                matchingId,
                member.getNickname() + " 회원이 " + log.getDate() + " 운동을 완료했습니다."
        ));

        return toResponse(log);
    }

    @Transactional
    public WorkoutLogResponse addPhoto(Long matchingId, Long logId, String userId, String photoUrl) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));
        workoutPhotoRepository.save(WorkoutPhoto.builder()
                .workoutLog(log).photoUrl(photoUrl).build());
        return toResponse(log);
    }

    @Transactional
    public WorkoutLogResponse deletePhoto(Long matchingId, Long logId, Long photoId, String userId) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));
        workoutPhotoRepository.deleteById(photoId);
        return toResponse(log);
    }

    @Transactional
    public WorkoutLogResponse cancelComplete(Long matchingId, Long logId, String userId) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));
        log.cancelComplete();
        return toResponse(log);
    }

    public List<Map<String, Object>> getCompletedDates(List<Long> matchingIds) {
        if (matchingIds == null || matchingIds.isEmpty()) return List.of();
        return workoutLogRepository.findCompletedDatesWithMatchingIdsByMatchingIds(matchingIds)
                .stream()
                .map(row -> Map.of(
                        "date", row[0].toString(),
                        "matchingId", row[1]
                ))
                .toList();
    }

    public List<Map<String, Object>> getAllDates(List<Long> matchingIds) {
        if (matchingIds == null || matchingIds.isEmpty()) return List.of();
        return workoutLogRepository.findAllDatesWithMatchingIdsByMatchingIds(matchingIds)
                .stream()
                .map(row -> Map.of(
                        "date", row[0].toString(),
                        "matchingId", row[1],
                        "completed", row[2]
                ))
                .toList();
    }

    @Transactional
    public WorkoutLogResponse updateTrainerComment(Long matchingId, Long logId, String userId, String comment) {
        WorkoutLog log = workoutLogRepository.findByMatchingResult_IdAndId(matchingId, logId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKOUT_LOG_NOT_FOUND));
        if (!log.getTrainer().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        log.updateTrainerComment(comment);

        if (comment != null && !comment.isBlank()) {
            Member member = log.getMatchingResult().getMatchingRequest().getMember();
            alertService.createAlert(new AlertRequest(
                    member.getId(),
                    AlertType.WORKOUT_LOG,
                    matchingId,
                    log.getTrainer().getNickname() + " 트레이너가 " + log.getDate() + " 기록에 코멘트를 남겼습니다."
            ));
        }

        return toResponse(log);
    }
}