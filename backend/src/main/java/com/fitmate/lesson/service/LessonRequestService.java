package com.fitmate.lesson.service;

import com.fitmate.alert.entity.AlertType;
import com.fitmate.global.exception.CustomException;
import com.fitmate.global.exception.ErrorCode;
import com.fitmate.lesson.dto.BookedTimeResponse;
import com.fitmate.lesson.dto.LessonRequestCreateRequest;
import com.fitmate.lesson.dto.LessonRequestResponse;
import com.fitmate.lesson.entity.LessonPassType;
import com.fitmate.lesson.entity.LessonRequest;
import com.fitmate.lesson.entity.LessonRequestSchedule;
import com.fitmate.lesson.entity.LessonRequestStatus;
import com.fitmate.lesson.event.LessonAlertEvent;
import com.fitmate.lesson.repository.LessonRequestRepository;
import com.fitmate.lesson.repository.LessonRequestScheduleRepository;
import com.fitmate.matching.entity.MatchingRequest;
import com.fitmate.matching.entity.MatchingResult;
import com.fitmate.matching.repository.MatchingResultRepository;
import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import com.fitmate.trainer.entity.TrainerAvailableTime;
import com.fitmate.trainer.entity.TrainerProfile;
import com.fitmate.trainer.repository.TrainerAvailableTimeRepository;
import com.fitmate.trainer.repository.TrainerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonRequestService {

    private static final Set<Integer> PACKAGE_COUNTS = Set.of(5, 10, 20);

    private final LessonRequestRepository lessonRequestRepository;
    private final LessonRequestScheduleRepository lessonRequestScheduleRepository;
    private final MatchingResultRepository matchingResultRepository;
    private final MemberRepository memberRepository;
    private final TrainerProfileRepository trainerProfileRepository;
    private final TrainerAvailableTimeRepository trainerAvailableTimeRepository;
    private final ApplicationEventPublisher eventPublisher;


    // 사용자가 추천 결과를 선택하거나, 트레이너를 직접 선택해서 레슨 요청서를 보냄
    @Transactional
    public LessonRequestResponse createLessonRequest(String userId, LessonRequestCreateRequest request) {

        // 로그인한 사용자를 DB에서 찾음
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        // 트레이너는 레슨 요청을 보낼 수 없음 (일반 회원만 가능)
        if (member.getRole() == Role.TRAINER) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 시간, 수강권 유형, 패키지 횟수 같은 입력값 검사
        validateRequest(request);

        LessonRequest lessonRequest;
        TrainerProfile trainerProfile;
        LessonRequestCreateRequest.ScheduleRequest firstSchedule =
                request.schedules().getFirst();

        if (request.matchingResultId() != null) {
            // ===== AI 매칭 경로 (기존 로직) =====

            MatchingResult matchingResult = matchingResultRepository.findById(request.matchingResultId())
                    .orElseThrow(() -> new CustomException(ErrorCode.MATCHING_RESULT_NOT_FOUND));

            validateOwner(member, matchingResult);

            validateDuplicateRequest(matchingResult.getId());

            trainerProfile = matchingResult.getTrainerProfile();
            validateSelectedConditions(
                    matchingResult.getMatchingRequest(),
                    trainerProfile,
                    request
            );
            validateAvailableTime(trainerProfile, request);

            lessonRequest = LessonRequest.builder()
                    .matchingResult(matchingResult)
                    .member(member)
                    .trainerProfile(trainerProfile)
                    .lessonPassType(request.lessonPassType())
                    .packageCount(request.packageCount())
                    .selectedSports(request.selectedSports())
                    .selectedLessonLevel(request.selectedLessonLevel())
                    .selectedLessonType(request.selectedLessonType())
                    .requestedDate(firstSchedule.requestedDate())
                    .requestedStartTime(firstSchedule.startTime())
                    .requestedEndTime(firstSchedule.endTime())
                    .message(request.message())
                    .status(LessonRequestStatus.PENDING)
                    .build();

        } else if (request.trainerProfileId() != null) {
            // ===== 트레이너 직접 선택 경로 (신규) =====

            trainerProfile = trainerProfileRepository.findById(request.trainerProfileId())
                    .orElseThrow(() -> new CustomException(ErrorCode.TRAINER_PROFILE_NOT_FOUND));

            validateDuplicateDirectRequest(member.getId(), trainerProfile.getId());

            validateSelectedConditions(null, trainerProfile, request);
            validateAvailableTime(trainerProfile, request);

            lessonRequest = LessonRequest.builder()
                    .matchingResult(null)
                    .member(member)
                    .trainerProfile(trainerProfile)
                    .lessonPassType(request.lessonPassType())
                    .packageCount(request.packageCount())
                    .selectedSports(request.selectedSports())
                    .selectedLessonLevel(request.selectedLessonLevel())
                    .selectedLessonType(request.selectedLessonType())
                    .selectedRegion(request.selectedRegion())
                    .requestedDate(firstSchedule.requestedDate())
                    .requestedStartTime(firstSchedule.startTime())
                    .requestedEndTime(firstSchedule.endTime())
                    .message(request.message())
                    .status(LessonRequestStatus.PENDING)
                    .build();

        } else {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        // DB에 요청서 저장
        LessonRequest savedLessonRequest = lessonRequestRepository.save(lessonRequest);

        List<LessonRequestSchedule> schedules =
                request.schedules().stream()
                        .map(schedule ->
                                LessonRequestSchedule.builder()
                                        .lessonRequest(savedLessonRequest)
                                        .requestedDate(schedule.requestedDate())
                                        .startTime(schedule.startTime())
                                        .endTime(schedule.endTime())
                                        .build()
                        )
                        .toList();

        lessonRequestScheduleRepository.saveAll(schedules);

        eventPublisher.publishEvent(new LessonAlertEvent(
                trainerProfile.getMember().getId(),
                AlertType.LESSON_REQUEST,
                savedLessonRequest.getId(),
                member.getNickname() + "님이 레슨을 요청했습니다."
        ));

        // 저장된 요청서를 화면에 보여줄 응답 DTO로 변환
        return toResponse(savedLessonRequest);
    }

    // 로그인한 트레이너가 받은 요청서 목록 조회
    public List<LessonRequestResponse> getTrainerLessonRequests(String trainerUserId) {
        return lessonRequestRepository.findByTrainerProfileMemberUserIdOrderByCreatedAtDesc(trainerUserId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 로그인한 사용자가 보낸 요청서 목록 조회
    public List<LessonRequestResponse> getMemberLessonRequests(String memberUserId) {
        return lessonRequestRepository.findByMemberUserIdOrderByCreatedAtDesc(memberUserId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 요청서 상세 조회
    public LessonRequestResponse getLessonRequest(Long lessonRequestId, String userId) {
        LessonRequest lessonRequest = lessonRequestRepository.findById(lessonRequestId)
                .orElseThrow(() -> new CustomException(ErrorCode.LESSON_REQUEST_NOT_FOUND));

        validateParticipant(lessonRequest, userId);

        return toResponse(lessonRequest);
    }

    // 트레이너가 레슨 요청서를 수락
    @Transactional
    public LessonRequestResponse acceptLessonRequest(Long lessonRequestId, String trainerUserId) {
        LessonRequest lessonRequest = lessonRequestRepository.findById(lessonRequestId)
                .orElseThrow(() -> new CustomException(ErrorCode.LESSON_REQUEST_NOT_FOUND));

        // 요청서를 받은 트레이너 본인인지 확인
        validateTrainerOwner(lessonRequest, trainerUserId);

        // 아직 대기중인 요청서인지 확인
        validatePendingStatus(lessonRequest);

        // 상태를 ACCEPTED로 변경
        lessonRequest.accept();

        eventPublisher.publishEvent(new LessonAlertEvent(
                lessonRequest.getMember().getId(),
                AlertType.LESSON_REQUEST,
                lessonRequest.getId(),
                lessonRequest.getTrainerProfile().getMember().getNickname()
                        + " 트레이너가 레슨 요청을 수락했습니다. 결제를 진행해 주세요."
        ));

        return toResponse(lessonRequest);
    }

    // 트레이너가 레슨 요청서를 거절
    @Transactional
    public LessonRequestResponse rejectLessonRequest(Long lessonRequestId, String trainerUserId) {
        LessonRequest lessonRequest = lessonRequestRepository.findById(lessonRequestId)
                .orElseThrow(() -> new CustomException(ErrorCode.LESSON_REQUEST_NOT_FOUND));

        // 요청서를 받은 트레이너 본인인지 확인
        validateTrainerOwner(lessonRequest, trainerUserId);

        // 아직 대기중인 요청서인지 확인
        validatePendingStatus(lessonRequest);

        // 상태를 REJECTED로 변경
        lessonRequest.reject();

        return toResponse(lessonRequest);
    }

    // 현재 로그인한 트레이너가 이 요청서를 받은 트레이너인지 확인
    private void validateTrainerOwner(LessonRequest lessonRequest, String trainerUserId) {
        String ownerUserId = lessonRequest.getTrainerProfile()
                .getMember()
                .getUserId();

        if (!ownerUserId.equals(trainerUserId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

    // 요청을 보낸 사용자 또는 요청을 받은 트레이너만 상세 내용을 조회할 수 있음
    private void validateParticipant(LessonRequest lessonRequest, String userId) {
        String memberUserId = lessonRequest.getMember().getUserId();
        String trainerUserId = lessonRequest.getTrainerProfile()
                .getMember()
                .getUserId();

        if (!memberUserId.equals(userId) && !trainerUserId.equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

    // 요청서가 아직 PENDING 상태인지 확인
    private void validatePendingStatus(LessonRequest lessonRequest) {
        if (lessonRequest.getStatus() != LessonRequestStatus.PENDING) {
            throw new CustomException(ErrorCode.LESSON_REQUEST_ALREADY_PROCESSED);
        }
    }

    // 매칭 결과의 주인이 현재 로그인한 사용자인지 확인
    private void validateOwner(Member member, MatchingResult matchingResult) {
        Member requestMember = matchingResult.getMatchingRequest().getMember();

        if (!requestMember.getId().equals(member.getId())) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

    // 같은 매칭 결과로 요청서를 중복 생성하지 못하게 막음
    private void validateDuplicateRequest(Long matchingResultId) {
        if (lessonRequestRepository.existsByMatchingResultId(matchingResultId)) {
            throw new CustomException(ErrorCode.LESSON_REQUEST_ALREADY_EXISTS);
        }
    }

    // 1회권은 packageCount가 없어야 하고, 패키지권은 5·10·20회만 허용합니다.
    private void validateRequest(LessonRequestCreateRequest request) {
        if (request.schedules().size() != 1) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        if (request.lessonPassType() == LessonPassType.ONE_TIME
                && request.packageCount() != null) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        if (request.lessonPassType() == LessonPassType.PACKAGE
                && !PACKAGE_COUNTS.contains(request.packageCount())) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        for (LessonRequestCreateRequest.ScheduleRequest schedule :
                request.schedules()) {
            if (!schedule.startTime().isBefore(schedule.endTime())) {
                throw new CustomException(ErrorCode.INVALID_INPUT);
            }
        }
    }

    // LessonRequest 엔티티를 프론트에 보낼 응답 DTO로 변환
    private LessonRequestResponse toResponse(LessonRequest lessonRequest) {
        MatchingResult matchingResult = lessonRequest.getMatchingResult();
        TrainerProfile trainerProfile = lessonRequest.getTrainerProfile();

        Member member = lessonRequest.getMember();
        Member trainerMember = trainerProfile.getMember();

        // 매칭 결과가 있으면 거기서, 없으면(트레이너 직접 선택) 트레이너 프로필에서 직접 가져옴
        String sports = lessonRequest.getSelectedSports();
        String lessonType = lessonRequest.getSelectedLessonType();
        String level = lessonRequest.getSelectedLessonLevel();
        String region;

        if (matchingResult != null) {
            MatchingRequest matchingRequest = matchingResult.getMatchingRequest();
            sports = sports != null ? sports : matchingRequest.getSports();
            lessonType = lessonType != null ? lessonType : matchingRequest.getLessonType();
            level = level != null ? level : matchingRequest.getLevel();
            region = matchingRequest.getRegion();
        } else {
            sports = sports != null ? sports : trainerProfile.getSports();
            lessonType = lessonType != null ? lessonType : trainerProfile.getLessonType();
            level = level != null ? level : trainerProfile.getLessonLevel();
            region = lessonRequest.getSelectedRegion() != null
                    ? lessonRequest.getSelectedRegion()
                    : trainerMember.getRegion();
        }

        List<LessonRequestResponse.ScheduleResponse> schedules =
                lessonRequestScheduleRepository
                        .findByLessonRequestIdOrderByRequestedDateAscStartTimeAsc(
                                lessonRequest.getId()
                        )
                        .stream()
                        .map(schedule ->
                                new LessonRequestResponse.ScheduleResponse(
                                        schedule.getId(),
                                        schedule.getRequestedDate(),
                                        schedule.getStartTime(),
                                        schedule.getEndTime()
                                )
                        )
                        .toList();

        if (schedules.isEmpty()) {
            schedules = List.of(
                    new LessonRequestResponse.ScheduleResponse(
                            null,
                            lessonRequest.getRequestedDate(),
                            lessonRequest.getRequestedStartTime(),
                            lessonRequest.getRequestedEndTime()
                    )
            );
        }

        return new LessonRequestResponse(
                lessonRequest.getId(),
                matchingResult != null ? matchingResult.getId() : null,

                member.getId(),
                member.getNickname(),
                member.getProfileImage(),
                member.getIntroduction(),

                trainerProfile.getId(),
                trainerMember.getNickname(),
                trainerMember.getProfileImage(),

                sports,
                lessonType,
                level,
                region,
                trainerProfile.getPrice(),

                lessonRequest.getLessonPassType(),
                lessonRequest.getPackageCount(),

                lessonRequest.getRequestedDate(),
                lessonRequest.getRequestedStartTime(),
                lessonRequest.getRequestedEndTime(),
                schedules,

                lessonRequest.getMessage(),
                lessonRequest.getStatus(),

                lessonRequest.getCreatedAt()
        );
    }

    // 트레이너 직접 선택 경로에서 중복 요청 방지
    private void validateDuplicateDirectRequest(Long memberId, Long trainerProfileId) {
        boolean exists = lessonRequestRepository.existsByMemberIdAndTrainerProfileIdAndStatus(
                memberId, trainerProfileId, LessonRequestStatus.PENDING
        );

        if (exists) {
            throw new CustomException(ErrorCode.LESSON_REQUEST_ALREADY_EXISTS);
        }
    }

    // 요청한 날짜/시간이 트레이너의 실제 가능 시간대에 포함되는지 확인
    private void validateAvailableTime(TrainerProfile trainerProfile, LessonRequestCreateRequest request) {
        List<TrainerAvailableTime> availableTimes =
                trainerAvailableTimeRepository.findByTrainerProfileId(
                        trainerProfile.getId()
                );

        for (LessonRequestCreateRequest.ScheduleRequest schedule :
                request.schedules()) {
            String requestedDayOfWeek =
                    schedule.requestedDate().getDayOfWeek().name();

            boolean matches = availableTimes.stream()
                    .anyMatch(time ->
                            normalizeDay(time.getDayOfWeek())
                                    .equals(requestedDayOfWeek)
                                    && !schedule.startTime()
                                    .isBefore(time.getStartTime())
                                    && !schedule.endTime()
                                    .isAfter(time.getEndTime())
                    );

            if (!matches) {
                throw new CustomException(ErrorCode.INVALID_INPUT);
            }
        }
    }

    private void validateSelectedConditions(
            MatchingRequest matchingRequest,
            TrainerProfile trainerProfile,
            LessonRequestCreateRequest request
    ) {
        if (!containsValue(
                trainerProfile.getSports(),
                request.selectedSports(),
                this::normalizeSport
        ) || !containsValue(
                trainerProfile.getLessonLevel(),
                request.selectedLessonLevel(),
                this::normalizeLessonLevel
        ) || !containsValue(
                trainerProfile.getLessonType(),
                request.selectedLessonType(),
                this::normalizeLessonType
        )) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        if (matchingRequest == null) {
            return;
        }

        if (!containsValue(
                matchingRequest.getSports(),
                request.selectedSports(),
                this::normalizeSport
        ) || !containsValue(
                matchingRequest.getLevel(),
                request.selectedLessonLevel(),
                this::normalizeLessonLevel
        ) || !containsValue(
                matchingRequest.getLessonType(),
                request.selectedLessonType(),
                this::normalizeLessonType
        )) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }
    }

    // 특정 트레이너의 특정 날짜에 이미 확정된 레슨 시간대 목록 조회 (시간 슬롯 중복 방지용)
    public List<BookedTimeResponse> getBookedTimes(Long trainerProfileId, LocalDate date) {
        return lessonRequestRepository
                .findByTrainerProfileIdAndRequestedDateAndStatus(
                        trainerProfileId, date, LessonRequestStatus.ACCEPTED
                )
                .stream()
                .map(lr -> new BookedTimeResponse(lr.getRequestedStartTime(), lr.getRequestedEndTime()))
                .toList();
    }

    private boolean containsValue(
            String storedValues,
            String selectedValue,
            Function<String, String> normalizer
    ) {
        if (storedValues == null || selectedValue == null) {
            return false;
        }

        String normalizedSelected = normalizer.apply(selectedValue);

        return Arrays.stream(storedValues.split(","))
                .map(String::trim)
                .map(normalizer)
                .anyMatch(normalizedSelected::equals);
    }

    private String normalizeSport(String value) {
        String normalized = normalizeText(value);

        return switch (normalized) {
            case "PT", "헬스", "웨이트" -> "헬스";
            default -> normalized;
        };
    }

    private String normalizeLessonType(String value) {
        return switch (normalizeText(value)) {
            case "ONE_TO_ONE", "1:1", "1:1PT", "1대1", "개인" -> "ONE_TO_ONE";
            case "GROUP", "그룹" -> "GROUP";
            default -> normalizeText(value);
        };
    }

    private String normalizeLessonLevel(String value) {
        return switch (normalizeText(value)) {
            case "입문", "초보", "초급", "입문/초보", "입문/초급" -> "BEGINNER";
            case "중급" -> "INTERMEDIATE";
            case "고급", "대회준비", "고급/대회준비" -> "ADVANCED";
            default -> normalizeText(value);
        };
    }

    private String normalizeText(String value) {
        return value == null
                ? ""
                : value.trim().replace(" ", "").toUpperCase();
    }

    private String normalizeDay(String value) {
        if (value == null) {
            return "";
        }

        return switch (value.trim().toUpperCase()) {
            case "MON", "MONDAY", "월", "월요일" -> "MONDAY";
            case "TUE", "TUESDAY", "화", "화요일" -> "TUESDAY";
            case "WED", "WEDNESDAY", "수", "수요일" -> "WEDNESDAY";
            case "THU", "THURSDAY", "목", "목요일" -> "THURSDAY";
            case "FRI", "FRIDAY", "금", "금요일" -> "FRIDAY";
            case "SAT", "SATURDAY", "토", "토요일" -> "SATURDAY";
            case "SUN", "SUNDAY", "일", "일요일" -> "SUNDAY";
            default -> value.trim().toUpperCase();
        };
    }
}
