'use client'

import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { formatLessonType } from '@/utils/lessonDisplay'
import { FormEvent, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

type MatchingResult = components['schemas']['MatchingResultResponse']
type LessonPassType = 'ONE_TIME' | 'REGULAR'

export type LessonRequestSummary = {
    sports?: string
    level?: string
    lessonType?: string
    region?: string
    district?: string
    lessonContent?: string
}

type LessonRequestFormProps = {
    result: MatchingResult
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

export default function LessonRequestForm({ result, summary }: LessonRequestFormProps) {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState('')
    const [lessonPassType, setLessonPassType] = useState<LessonPassType>('ONE_TIME')
    const [weeklyCount, setWeeklyCount] = useState(2)
    const [message, setMessage] = useState(summary?.lessonContent ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const matchedDayIndex = DAY_INDEX[result.dayOfWeek ?? '']
    const matchedDayLabel =
        matchedDayIndex === undefined ? result.dayOfWeek ?? '-' : `${DAY_LABELS[matchedDayIndex]}요일`

    const location = [result.region ?? summary?.region, summary?.district]
        .filter(Boolean)
        .join(' ')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!result.matchingResultId) {
            setErrorMessage('선택한 매칭 결과를 확인할 수 없습니다.')
            return
        }

        if (!selectedDate) {
            setErrorMessage('레슨을 시작할 날짜를 선택해 주세요.')
            return
        }

        if (!result.preferredStartTime || !result.preferredEndTime) {
            setErrorMessage('매칭된 레슨 시간을 확인할 수 없습니다.')
            return
        }

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const client = getAuthClient()
            const { data, error } = await client.POST('/api/lesson-requests', {
                body: {
                    matchingResultId: result.matchingResultId,
                    lessonPassType,
                    weeklyCount: lessonPassType === 'REGULAR' ? weeklyCount : undefined,
                    requestedDate: selectedDate,
                    requestedStartTime: toApiTime(result.preferredStartTime),
                    requestedEndTime: toApiTime(result.preferredEndTime),
                    message: message.trim() || undefined,
                },
            })

            if (error || !data) {
                const apiError = error as { code?: string; message?: string } | undefined

                if (apiError?.code === '409-6') {
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
                    {result.profileImage ? (
                        <img
                            src={getImageUrl(result.profileImage)}
                            alt={`${result.trainerName ?? '트레이너'} 프로필`}
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
                        {result.trainerName ?? '트레이너'}
                    </h2>
                    <div className="mt-xs flex flex-wrap gap-xs">
                        {[
                            result.lessonType
                                ? formatLessonType(result.lessonType)
                                : undefined,
                            result.sports,
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
                <div className="flex flex-wrap items-start justify-between gap-xs">
                    <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            일정 확정
                        </h2>
                        <p className="mt-xs text-body-sm text-on-surface-variant">
                            매칭된 {matchedDayLabel} 시간에 맞춰 시작 날짜를 선택해 주세요.
                        </p>
                    </div>
                    <span className="rounded-md bg-primary-fixed px-xs py-1 text-label-sm text-primary">
                        요청된 시간
                    </span>
                </div>

                <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-2">
                    <LessonCalendar
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                        allowedDayIndex={matchedDayIndex}
                    />

                    <div className="space-y-md">
                        <div>
                            <p className="text-label-md font-label-md text-on-surface-variant">
                                매칭된 시간
                            </p>
                            <div className="mt-xs rounded-lg border-2 border-primary bg-primary-fixed/35 p-sm">
                                <p className="font-label-bold text-primary">
                                    {matchedDayLabel} {formatTime(result.preferredStartTime)} -{' '}
                                    {formatTime(result.preferredEndTime)}
                                </p>
                                <p className="mt-1 text-body-sm text-on-surface-variant">
                                    트레이너 가능 시간 {formatTime(result.trainerStartTime)} -{' '}
                                    {formatTime(result.trainerEndTime)}
                                </p>
                            </div>
                        </div>

                        <fieldset>
                            <legend className="text-label-md font-label-md text-on-surface-variant">
                                수강 유형
                            </legend>
                            <div className="mt-xs grid grid-cols-2 gap-xs">
                                <PassTypeButton
                                    selected={lessonPassType === 'ONE_TIME'}
                                    onClick={() => setLessonPassType('ONE_TIME')}
                                >
                                    1회성
                                </PassTypeButton>
                                <PassTypeButton
                                    selected={lessonPassType === 'REGULAR'}
                                    onClick={() => setLessonPassType('REGULAR')}
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
                                    onChange={(event) => setWeeklyCount(Number(event.target.value))}
                                    className="mt-xs h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map((count) => (
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
                    <SummaryRow icon="fitness_center" label="운동 종목" value={result.sports} />
                    <SummaryRow
                        icon="groups"
                        label="레슨 유형"
                        value={formatLessonType(result.lessonType)}
                    />
                    <SummaryRow
                        icon="trending_up"
                        label="레슨 수준"
                        value={summary?.level ?? result.lessonLevel}
                    />
                    <SummaryRow icon="location_on" label="장소" value={location || '-'} />
                    <SummaryRow
                        icon="payments"
                        label="금액 (1회)"
                        value={
                            result.price
                                ? `${result.price.toLocaleString('ko-KR')}원`
                                : '-'
                        }
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
    allowedDayIndex?: number
}

function LessonCalendar({ selectedDate, onSelect, allowedDayIndex }: LessonCalendarProps) {
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
        setVisibleMonth(
            (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1)
        )
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
                            allowedDayIndex !== undefined && date.getDay() !== allowedDayIndex
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
