'use client'

import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { formatLessonType } from '@/utils/lessonDisplay'
import { FormEvent, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

type MatchingResult = components['schemas']['MatchingResultResponse']
type LessonPassType = 'ONE_TIME' | 'REGULAR'
type SelectedSchedule = {
    id: string
    requestedDate: string
    startTime: string
    endTime: string
}

export type LessonRequestSummary = {
    sports?: string
    level?: string
    lessonType?: string
    region?: string
    district?: string
    lessonContent?: string
}

export type TrainerScheduleInfo = {
    trainerProfileId: number
    trainerName: string
    profileImage?: string
    sports?: string
    lessonType?: string
    lessonLevel?: string
    price?: number
    lessonDurationMinutes?: number
    availableTimes: Array<{
        dayOfWeek: string
        startTime: string
        endTime: string
    }>
}

type LessonRequestFormProps = {
    matchingResult?: MatchingResult
    directTrainer?: TrainerScheduleInfo
    matchedTrainer?: TrainerScheduleInfo
    summary: LessonRequestSummary | null
}

const DAY_INDEX: Record<string, number> = {
    SUNDAY: 0,
    일요일: 0,
    MONDAY: 1,
    월요일: 1,
    TUESDAY: 2,
    화요일: 2,
    WEDNESDAY: 3,
    수요일: 3,
    THURSDAY: 4,
    목요일: 4,
    FRIDAY: 5,
    금요일: 5,
    SATURDAY: 6,
    토요일: 6,
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const formatTime = (time?: string) => time?.slice(0, 5) ?? '-'

const toApiTime = (time?: string) => {
    if (!time) return ''
    return time.length === 5 ? `${time}:00` : time
}

const toDateValue = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const getWeekStartValue = (dateValue: string) => {
    const date = new Date(`${dateValue}T00:00:00`)
    const dayOffset = date.getDay() === 0 ? 6 : date.getDay() - 1
    date.setDate(date.getDate() - dayOffset)
    return toDateValue(date)
}

const splitValues = (value?: string) =>
    value
        ?.split(',')
        .map((item) => item.trim())
        .filter(Boolean) ?? []

const normalizeText = (value: string) => value.trim().replaceAll(' ', '').toUpperCase()

const normalizeSport = (value: string) => {
    const normalized = normalizeText(value)
    return ['PT', '헬스', '웨이트'].includes(normalized) ? '헬스' : normalized
}

const normalizeLessonLevel = (value: string) => {
    const normalized = normalizeText(value)

    if (['입문', '초보', '초급', '입문/초보', '입문/초급'].includes(normalized)) {
        return 'BEGINNER'
    }
    if (normalized === '중급') return 'INTERMEDIATE'
    if (['고급', '대회준비', '고급/대회준비'].includes(normalized)) return 'ADVANCED'
    return normalized
}

const normalizeLessonType = (value: string) => {
    const normalized = normalizeText(value)

    if (['ONE_TO_ONE', '1:1', '1:1PT', '1대1', '개인'].includes(normalized)) {
        return 'ONE_TO_ONE'
    }
    if (['GROUP', '그룹'].includes(normalized)) return 'GROUP'
    if (['ONLINE', '온라인'].includes(normalized)) return 'ONLINE'
    return normalized
}

const formatLessonLevelOption = (value: string) => {
    const normalized = normalizeLessonLevel(value)
    if (normalized === 'BEGINNER') return '입문/초급'
    if (normalized === 'INTERMEDIATE') return '중급'
    if (normalized === 'ADVANCED') return '고급/대회준비'
    return value
}

const formatLessonTypeOption = (value: string) => {
    const normalized = normalizeLessonType(value)
    if (normalized === 'ONE_TO_ONE') return '1:1'
    if (normalized === 'GROUP') return '그룹'
    if (normalized === 'ONLINE') return '온라인'
    return formatLessonType(value)
}

const getCommonOptions = (
    requestedValue: string | undefined,
    trainerValue: string | undefined,
    normalizer: (value: string) => string,
    formatter: (value: string) => string = (value) => value
) => {
    const requestedValues = splitValues(requestedValue)
    const trainerValues = splitValues(trainerValue)
    const trainerKeys = new Set(trainerValues.map(normalizer))
    const sourceValues = requestedValues.length > 0 ? requestedValues : trainerValues
    const commonValues =
        trainerKeys.size > 0
            ? sourceValues.filter((value) => trainerKeys.has(normalizer(value)))
            : sourceValues
    const uniqueValues = new Map<string, string>()

    commonValues.forEach((value) => {
        uniqueValues.set(normalizer(value), formatter(value))
    })

    return [...uniqueValues.values()]
}

export default function LessonRequestForm({
    matchingResult,
    directTrainer,
    matchedTrainer,
    summary,
}: LessonRequestFormProps) {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState('')
    const [lessonPassType, setLessonPassType] = useState<LessonPassType>('ONE_TIME')
    const [weeklyCount, setWeeklyCount] = useState(2)
    const [message, setMessage] = useState(summary?.lessonContent ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedSchedules, setSelectedSchedules] = useState<SelectedSchedule[]>([])

    const isDirectMode = Boolean(directTrainer && !matchingResult)
    const scheduleTrainer = directTrainer ?? matchedTrainer
    const sportsOptions = getCommonOptions(
        isDirectMode ? undefined : summary?.sports,
        scheduleTrainer?.sports ?? matchingResult?.sports,
        normalizeSport
    )
    const lessonLevelOptions = getCommonOptions(
        isDirectMode ? undefined : summary?.level,
        scheduleTrainer?.lessonLevel ?? matchingResult?.lessonLevel,
        normalizeLessonLevel,
        formatLessonLevelOption
    )
    const lessonTypeOptions = getCommonOptions(
        isDirectMode ? undefined : summary?.lessonType,
        scheduleTrainer?.lessonType ?? matchingResult?.lessonType,
        normalizeLessonType,
        formatLessonTypeOption
    )
    const [selectedSportsValue, setSelectedSportsValue] = useState('')
    const [selectedLessonLevelValue, setSelectedLessonLevelValue] = useState('')
    const [selectedLessonTypeValue, setSelectedLessonTypeValue] = useState('')
    const selectedSports = selectedSportsValue || sportsOptions[0] || ''
    const selectedLessonLevel = selectedLessonLevelValue || lessonLevelOptions[0] || ''
    const selectedLessonType = selectedLessonTypeValue || lessonTypeOptions[0] || ''

    const location = [matchingResult?.region ?? summary?.region, summary?.district]
        .filter(Boolean)
        .join(' ')

    const displayProfileImage = isDirectMode
        ? directTrainer!.profileImage
        : matchingResult?.profileImage
    const displayTrainerName = isDirectMode
        ? directTrainer!.trainerName
        : matchingResult?.trainerName
    const displaySports = isDirectMode ? directTrainer!.sports : matchingResult?.sports
    const displayLessonType = isDirectMode ? directTrainer!.lessonType : matchingResult?.lessonType
    const displayPrice = isDirectMode ? directTrainer!.price : matchingResult?.price

    // 트레이너 직접 모드: 캘린더에서 활성화할 요일들 (트레이너가 가능하다고 등록한 모든 요일)
    const matchedDayIndices =
        matchingResult?.dayOfWeek
            ?.split(',')
            .map((day) => DAY_INDEX[day.trim()])
            .filter((day): day is number => day !== undefined) ?? []

    const allowedDayIndices = matchingResult
        ? matchedDayIndices
        : (scheduleTrainer?.availableTimes
              .map((time) => DAY_INDEX[time.dayOfWeek])
              .filter((day): day is number => day !== undefined) ?? [])
    const uniqueAllowedDayCount = new Set(allowedDayIndices).size
    const maximumWeeklyCount = Math.max(1, Math.min(uniqueAllowedDayCount || 1, 7))

    // 트레이너 직접 모드: 사용자가 선택한 날짜의 요일에 해당하는 가능시간 슬롯 찾기
    const selectedDayTimes =
        scheduleTrainer && selectedDate
            ? scheduleTrainer.availableTimes.filter(
                  (t) => DAY_INDEX[t.dayOfWeek] === new Date(`${selectedDate}T00:00:00`).getDay()
              )
            : []

    // 선택한 트레이너의 가능시간 블록을 레슨 시간 단위로 잘라서 시작시간 목록 생성
    const lessonDuration = scheduleTrainer?.lessonDurationMinutes ?? 60

    const timeSlotOptions = useMemo(() => {
        const slots = selectedDayTimes.flatMap((availableTime) => {
            const [startH, startM] = availableTime.startTime.split(':').map(Number)
            const [endH, endM] = availableTime.endTime.split(':').map(Number)

            const startMinutes = startH * 60 + startM
            const endMinutes = endH * 60 + endM
            const availableSlots: string[] = []

            for (
                let time = startMinutes;
                time + lessonDuration <= endMinutes;
                time += lessonDuration
            ) {
                const hour = Math.floor(time / 60)
                const minute = time % 60
                availableSlots.push(
                    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
                )
            }

            return availableSlots
        })

        return [...new Set(slots)].sort()
    }, [selectedDayTimes, lessonDuration])

    const [selectedStartTime, setSelectedStartTime] = useState('')

    // 선택된 시작시간 + 레슨 시간으로 종료시간 계산
    const selectedEndTime = useMemo(() => {
        if (!selectedStartTime) return ''
        const [h, m] = selectedStartTime.split(':').map(Number)
        const totalMinutes = h * 60 + m + lessonDuration
        const endH = Math.floor(totalMinutes / 60)
        const endM = totalMinutes % 60
        return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
    }, [selectedStartTime, lessonDuration])

    const handlePassTypeChange = (nextType: LessonPassType) => {
        setLessonPassType(nextType)
        setSelectedSchedules([])
        setSelectedDate('')
        setSelectedStartTime('')

        if (nextType === 'REGULAR') {
            setWeeklyCount(Math.min(2, maximumWeeklyCount))
        }
    }

    const handleWeeklyCountChange = (count: number) => {
        setWeeklyCount(count)
        setSelectedSchedules([])
        setSelectedDate('')
        setSelectedStartTime('')
    }

    const addSelectedSchedule = () => {
        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
            setErrorMessage('날짜와 시작 시간을 먼저 선택해 주세요.')
            return
        }

        const selectedDayIndex = new Date(`${selectedDate}T00:00:00`).getDay()
        const alreadySelectedDay = selectedSchedules.some(
            (schedule) =>
                new Date(`${schedule.requestedDate}T00:00:00`).getDay() === selectedDayIndex
        )

        if (lessonPassType === 'REGULAR' && alreadySelectedDay) {
            setErrorMessage('정기권 일정은 서로 다른 요일로 선택해 주세요.')
            return
        }

        if (
            lessonPassType === 'REGULAR' &&
            selectedSchedules.length > 0 &&
            getWeekStartValue(selectedSchedules[0].requestedDate) !==
                getWeekStartValue(selectedDate)
        ) {
            setErrorMessage('정기권의 첫 일정들은 같은 주 안에서 선택해 주세요.')
            return
        }

        const nextSchedule: SelectedSchedule = {
            id: `${selectedDate}-${selectedStartTime}`,
            requestedDate: selectedDate,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
        }

        if (lessonPassType === 'ONE_TIME') {
            setSelectedSchedules([nextSchedule])
        } else {
            if (selectedSchedules.length >= weeklyCount) {
                setErrorMessage(`정기권은 주 ${weeklyCount}회까지만 선택할 수 있습니다.`)
                return
            }
            setSelectedSchedules((current) => [...current, nextSchedule])
        }

        setSelectedDate('')
        setSelectedStartTime('')
        setErrorMessage('')
    }

    const removeSelectedSchedule = (scheduleId: string) => {
        setSelectedSchedules((current) => current.filter((schedule) => schedule.id !== scheduleId))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!selectedSports || !selectedLessonLevel || !selectedLessonType) {
            setErrorMessage('선택할 수 있는 공통 레슨 조건이 없습니다.')
            return
        }

        const requiredScheduleCount = lessonPassType === 'REGULAR' ? weeklyCount : 1

        if (selectedSchedules.length !== requiredScheduleCount) {
            setErrorMessage(
                lessonPassType === 'REGULAR'
                    ? `서로 다른 요일의 일정을 ${weeklyCount}개 선택해 주세요.`
                    : '레슨 일정을 1개 선택해 주세요.'
            )
            return
        }

        if (!isDirectMode && !matchingResult?.matchingResultId) {
            setErrorMessage('선택한 매칭 결과를 확인할 수 없습니다.')
            return
        }

        const firstSchedule = selectedSchedules[0]
        const requestedStartTime = toApiTime(firstSchedule.startTime)
        const requestedEndTime = toApiTime(firstSchedule.endTime)

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const client = getAuthClient()
            const { data, error } = await client.POST('/api/lesson-requests', {
                body: {
                    matchingResultId: isDirectMode ? undefined : matchingResult!.matchingResultId,
                    trainerProfileId: isDirectMode ? directTrainer!.trainerProfileId : undefined,
                    lessonPassType,
                    weeklyCount: lessonPassType === 'REGULAR' ? weeklyCount : undefined,
                    selectedSports,
                    selectedLessonLevel,
                    selectedLessonType,
                    requestedDate: firstSchedule.requestedDate,
                    requestedStartTime,
                    requestedEndTime,
                    schedules: selectedSchedules.map((schedule) => ({
                        requestedDate: schedule.requestedDate,
                        startTime: toApiTime(schedule.startTime),
                        endTime: toApiTime(schedule.endTime),
                    })),
                    message: message.trim() || undefined,
                },
            })

            if (error || !data) {
                const apiError = error as { code?: string; message?: string } | undefined

                if (apiError?.code === '409-6' || apiError?.code === '409-7') {
                    setErrorMessage('이미 이 트레이너에게 보낸 레슨 요청이 있습니다.')
                } else {
                    setErrorMessage(apiError?.message ?? '레슨 요청을 전송하지 못했습니다.')
                }
                return
            }

            window.alert('레슨 요청이 전송되었습니다.')
            router.push('/mypage')
        } catch {
            setErrorMessage('서버에 연결할 수 없습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-md">
            <section className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                    {displayProfileImage ? (
                        <img
                            src={getImageUrl(displayProfileImage)}
                            alt={`${displayTrainerName ?? '트레이너'} 프로필`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-outline">
                                person
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        {displayTrainerName ?? '트레이너'}
                    </h2>
                    <div className="mt-xs flex flex-wrap gap-xs">
                        {[
                            displayLessonType ? formatLessonType(displayLessonType) : undefined,
                            displaySports,
                        ]
                            .filter((value): value is string => Boolean(value))
                            .map((value) => (
                                <span
                                    key={value}
                                    className="rounded-md bg-primary-fixed px-xs py-1 text-label-sm text-on-primary-fixed"
                                >
                                    {value}
                                </span>
                            ))}
                    </div>
                </div>
            </section>
            <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:p-lg">
                <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        최종 레슨 조건
                    </h2>
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                        요청 조건과 트레이너의 제공 항목이 겹치는 값 중 하나씩 선택해 주세요.
                    </p>
                </div>

                <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-3">
                    <SingleChoiceGroup
                        label="운동 종목"
                        options={sportsOptions}
                        selectedValue={selectedSports}
                        onSelect={setSelectedSportsValue}
                    />
                    <SingleChoiceGroup
                        label="레슨 수준"
                        options={lessonLevelOptions}
                        selectedValue={selectedLessonLevel}
                        onSelect={setSelectedLessonLevelValue}
                    />
                    <SingleChoiceGroup
                        label="레슨 유형"
                        options={lessonTypeOptions}
                        selectedValue={selectedLessonType}
                        onSelect={setSelectedLessonTypeValue}
                    />
                </div>
            </section>
            <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:p-lg">
                <div className="flex flex-wrap items-start justify-between gap-xs">
                    <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            일정 확정
                        </h2>
                        <p className="mt-xs text-body-sm text-on-surface-variant">
                            추천 조건과 겹치는 요일 중 트레이너가 가능한 날짜와 시간을 선택해
                            주세요.
                        </p>
                    </div>
                    <span className="rounded-md bg-primary-fixed px-xs py-1 text-label-sm text-primary">
                        일정 선택
                    </span>
                </div>

                <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-2">
                    <LessonCalendar
                        selectedDate={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date)
                            setSelectedStartTime('')
                        }}
                        allowedDayIndices={allowedDayIndices}
                    />

                    <div className="space-y-md">
                        <div>
                            <p className="text-label-md font-label-md text-on-surface-variant">
                                선택한 시간
                            </p>
                            {selectedDayTimes.length > 0 ? (
                                timeSlotOptions.length > 0 ? (
                                    <div className="mt-xs space-y-sm">
                                        <p className="text-label-sm text-on-surface-variant">
                                            가능 시간{' '}
                                            {selectedDayTimes
                                                .map(
                                                    (time) =>
                                                        `${formatTime(time.startTime)}-${formatTime(time.endTime)}`
                                                )
                                                .join(', ')}{' '}
                                            (레슨 {lessonDuration}분)
                                        </p>
                                        <div className="grid grid-cols-3 gap-xs">
                                            {timeSlotOptions.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setSelectedStartTime(time)}
                                                    className={`h-10 rounded-lg border text-body-sm font-label-bold transition-colors ${
                                                        selectedStartTime === time
                                                            ? 'border-primary bg-primary text-on-primary'
                                                            : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedStartTime && (
                                            <div className="flex flex-wrap items-center justify-between gap-xs">
                                                <p className="text-body-sm font-label-bold text-primary">
                                                    선택된 시간: {selectedStartTime} -{' '}
                                                    {selectedEndTime}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={addSelectedSchedule}
                                                    className="inline-flex h-10 items-center gap-1 rounded-lg bg-primary px-sm font-label-bold text-on-primary hover:bg-primary/90"
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        add
                                                    </span>
                                                    일정 추가
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-xs rounded-lg border border-outline-variant p-sm">
                                        <p className="text-body-sm text-on-surface-variant">
                                            이 날짜에는 예약 가능한 시간이 없습니다.
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="mt-xs rounded-lg border border-outline-variant p-sm">
                                    <p className="text-body-sm text-on-surface-variant">
                                        캘린더에서 날짜를 먼저 선택해 주세요.
                                    </p>
                                </div>
                            )}
                        </div>

                        {selectedSchedules.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-xs">
                                    <p className="text-label-md font-label-md text-on-surface-variant">
                                        확정할 일정
                                    </p>
                                    <span className="text-label-sm text-primary">
                                        {selectedSchedules.length}/
                                        {lessonPassType === 'REGULAR' ? weeklyCount : 1}
                                    </span>
                                </div>
                                <div className="mt-xs space-y-xs">
                                    {selectedSchedules.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="flex items-center justify-between gap-sm rounded-lg border border-outline-variant bg-surface-container-low p-sm"
                                        >
                                            <div>
                                                <p className="font-label-bold text-on-surface">
                                                    {getScheduleDayLabel(schedule.requestedDate)}
                                                </p>
                                                <p className="text-label-sm text-on-surface-variant">
                                                    {schedule.requestedDate.replaceAll('-', '.')} ·{' '}
                                                    {schedule.startTime}-{schedule.endTime}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedSchedule(schedule.id)}
                                                aria-label={`${schedule.requestedDate} 일정 삭제`}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error"
                                            >
                                                <span className="material-symbols-outlined">
                                                    close
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <fieldset>
                            <legend className="text-label-md font-label-md text-on-surface-variant">
                                수강 유형
                            </legend>
                            <div className="mt-xs grid grid-cols-2 gap-xs">
                                <PassTypeButton
                                    selected={lessonPassType === 'ONE_TIME'}
                                    onClick={() => handlePassTypeChange('ONE_TIME')}
                                >
                                    1회성
                                </PassTypeButton>
                                <PassTypeButton
                                    selected={lessonPassType === 'REGULAR'}
                                    onClick={() => handlePassTypeChange('REGULAR')}
                                >
                                    정기권
                                </PassTypeButton>
                            </div>
                        </fieldset>
                        {lessonPassType === 'REGULAR' && (
                            <label className="block text-label-md font-label-md text-on-surface-variant">
                                주당 횟수
                                <select
                                    value={weeklyCount}
                                    onChange={(event) =>
                                        handleWeeklyCountChange(Number(event.target.value))
                                    }
                                    className="mt-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                                >
                                    {Array.from(
                                        { length: maximumWeeklyCount },
                                        (_, index) => index + 1
                                    ).map((count) => (
                                        <option key={count} value={count}>
                                            주 {count}회
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                </div>
            </section>
            <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:p-lg">
                <h2 className="border-b border-outline-variant pb-sm font-headline-sm text-headline-sm text-on-surface">
                    레슨 상세 요약
                </h2>

                <dl className="mt-md space-y-sm">
                    <SummaryRow icon="fitness_center" label="운동 종목" value={selectedSports} />
                    <SummaryRow icon="groups" label="레슨 유형" value={selectedLessonType} />
                    <SummaryRow icon="trending_up" label="레슨 수준" value={selectedLessonLevel} />
                    <SummaryRow icon="location_on" label="장소" value={location || '-'} />
                    <SummaryRow
                        icon="payments"
                        label="금액 (1회)"
                        value={displayPrice ? `${displayPrice.toLocaleString('ko-KR')}원` : '-'}
                        emphasized
                    />
                </dl>
            </section>
            <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:p-lg">
                <label className="font-headline-sm text-headline-sm text-on-surface">
                    트레이너에게 보내는 메시지
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        maxLength={500}
                        rows={5}
                        placeholder="운동 목표나 트레이너에게 전달할 요청사항을 입력해 주세요."
                        className="mt-sm w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-sm text-body-md font-normal outline-none focus:border-primary"
                    />
                </label>
                <p className="mt-xs text-right text-label-sm text-outline">{message.length}/500</p>
            </section>
            {errorMessage && (
                <p className="rounded-lg bg-error-container p-sm text-body-sm text-on-error-container">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full rounded-lg bg-primary font-label-bold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-outline-variant"
            >
                {isSubmitting ? '요청 전송 중...' : '레슨 요청 완료하기'}
            </button>
        </form>
    )
}

type LessonCalendarProps = {
    selectedDate: string
    onSelect: (date: string) => void
    allowedDayIndices?: number[]
}

function LessonCalendar({ selectedDate, onSelect, allowedDayIndices }: LessonCalendarProps) {
    const today = useMemo(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    }, [])
    const [visibleMonth, setVisibleMonth] = useState(
        () => new Date(today.getFullYear(), today.getMonth(), 1)
    )

    const calendarDays = useMemo(() => {
        const year = visibleMonth.getFullYear()
        const month = visibleMonth.getMonth()
        const firstDayIndex = new Date(year, month, 1).getDay()
        const lastDate = new Date(year, month + 1, 0).getDate()

        return [
            ...Array.from({ length: firstDayIndex }, () => null),
            ...Array.from({ length: lastDate }, (_, index) => new Date(year, month, index + 1)),
        ]
    }, [visibleMonth])

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const canMovePrevious = visibleMonth.getTime() > currentMonth.getTime()

    const moveMonth = (offset: number) => {
        setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1))
    }

    return (
        <div>
            <p className="text-label-md font-label-md text-on-surface-variant">날짜 선택</p>
            <div className="mt-xs rounded-lg border border-outline-variant p-sm">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => moveMonth(-1)}
                        disabled={!canMovePrevious}
                        aria-label="이전 달"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <strong className="text-body-md text-on-surface">
                        {visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월
                    </strong>
                    <button
                        type="button"
                        onClick={() => moveMonth(1)}
                        aria-label="다음 달"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div className="mt-xs grid grid-cols-7 text-center text-label-sm text-outline">
                    {DAY_LABELS.map((day) => (
                        <span key={day} className="py-xs">
                            {day}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                        if (!date) {
                            return <span key={`empty-${index}`} className="aspect-square" />
                        }

                        const dateValue = toDateValue(date)
                        const isPast = date.getTime() < today.getTime()
                        const isWrongDay =
                            allowedDayIndices !== undefined &&
                            !allowedDayIndices.includes(date.getDay())
                        const disabled = isPast || isWrongDay
                        const selected = selectedDate === dateValue

                        return (
                            <button
                                key={dateValue}
                                type="button"
                                disabled={disabled}
                                onClick={() => onSelect(dateValue)}
                                className={`aspect-square rounded-full text-body-sm transition-colors ${
                                    selected
                                        ? 'bg-primary font-semibold text-on-primary'
                                        : disabled
                                          ? 'cursor-not-allowed text-outline/40'
                                          : 'text-on-surface hover:bg-primary-fixed hover:text-primary'
                                }`}
                            >
                                {date.getDate()}
                            </button>
                        )
                    })}
                </div>
            </div>

            <p className="mt-xs min-h-5 text-label-sm text-on-surface-variant">
                {selectedDate
                    ? `${selectedDate.replaceAll('-', '.')} 시작으로 요청합니다.`
                    : '활성화된 날짜 중 하나를 선택해 주세요.'}
            </p>
        </div>
    )
}

function SingleChoiceGroup({
    label,
    options,
    selectedValue,
    onSelect,
}: {
    label: string
    options: string[]
    selectedValue: string
    onSelect: (value: string) => void
}) {
    return (
        <fieldset>
            <legend className="text-label-md font-label-md text-on-surface-variant">{label}</legend>
            {options.length > 0 ? (
                <div className="mt-xs flex flex-wrap gap-xs">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onSelect(option)}
                            className={`min-h-10 rounded-lg border px-sm text-body-sm font-label-bold transition-colors ${
                                selectedValue === option
                                    ? 'border-primary bg-primary text-on-primary'
                                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="mt-xs rounded-lg bg-error-container p-xs text-label-sm text-on-error-container">
                    공통으로 선택할 수 있는 항목이 없습니다.
                </p>
            )}
        </fieldset>
    )
}

function PassTypeButton({
    selected,
    onClick,
    children,
}: {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-12 rounded-lg border font-label-bold transition-colors ${
                selected
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
        >
            {children}
        </button>
    )
}

function getScheduleDayLabel(date: string) {
    return `${DAY_LABELS[new Date(`${date}T00:00:00`).getDay()]}요일`
}

function SummaryRow({
    icon,
    label,
    value,
    emphasized = false,
}: {
    icon: string
    label: string
    value?: string
    emphasized?: boolean
}) {
    return (
        <div className="flex items-center justify-between gap-sm">
            <dt className="flex items-center gap-xs text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    {icon}
                </span>
                {label}
            </dt>
            <dd
                className={
                    emphasized
                        ? 'text-right text-title-lg font-semibold text-primary'
                        : 'text-right font-label-bold text-on-surface'
                }
            >
                {value ?? '-'}
            </dd>
        </div>
    )
}
