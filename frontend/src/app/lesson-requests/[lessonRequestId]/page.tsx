'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { formatLessonType } from '@/utils/lessonDisplay'
import { startPayment } from '@/utils/payment'
import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

type LessonRequest = components['schemas']['LessonRequestResponse']
type LessonRequestStatus = NonNullable<LessonRequest['status']>
type ResultModalType = 'ACCEPTED' | 'REJECTED' | null

const STATUS_LABELS: Record<LessonRequestStatus, string> = {
    PENDING: '답변 대기',
    ACCEPTED: '결제 대기',
    REJECTED: '거절됨',
    CANCELED: '취소됨',
    COMPLETED: '매칭 완료',
}

const DAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

const formatTime = (time?: string) => time?.slice(0, 5) ?? '-'

const formatDate = (date?: string) => {
    if (!date) return '-'
    return new Date(`${date}T00:00:00`).toLocaleDateString('ko-KR')
}

export default function LessonRequestDetailPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { lessonRequestId } = useParams<{ lessonRequestId: string }>()
    const [request, setRequest] = useState<LessonRequest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [processingAction, setProcessingAction] = useState<'accept' | 'reject' | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [modalType, setModalType] = useState<ResultModalType>(null)
    const isTrainer = user?.role === 'TRAINER'
    const matchingManagementHref = '/mypage?tab=matching'

    useEffect(() => {
        if (!lessonRequestId) {
            setErrorMessage('잘못된 레슨 요청 경로입니다.')
            setIsLoading(false)
            return
        }

        const loadRequest = async () => {
            try {
                const client = getAuthClient()
                const { data, error } = await client.GET('/api/lesson-requests/{lessonRequestId}', {
                    params: {
                        path: {
                            lessonRequestId: Number(lessonRequestId),
                        },
                    },
                })

                if (error || !data) {
                    setErrorMessage('레슨 요청 상세 내용을 불러오지 못했습니다.')
                    return
                }

                setRequest(data)
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadRequest()
    }, [lessonRequestId])

    const handleRequestAction = async (action: 'accept' | 'reject') => {
        if (!isTrainer || !request?.lessonRequestId || request.status !== 'PENDING') {
            return
        }

        setProcessingAction(action)
        setErrorMessage('')

        try {
            const client = getAuthClient()
            let updatedRequest: LessonRequest | undefined
            let requestError: unknown

            if (action === 'accept') {
                const { data, error } = await client.PATCH(
                    '/api/lesson-requests/{lessonRequestId}/accept',
                    {
                        params: {
                            path: {
                                lessonRequestId: request.lessonRequestId,
                            },
                        },
                    }
                )
                updatedRequest = data
                requestError = error
            } else {
                const { data, error } = await client.PATCH(
                    '/api/lesson-requests/{lessonRequestId}/reject',
                    {
                        params: {
                            path: {
                                lessonRequestId: request.lessonRequestId,
                            },
                        },
                    }
                )
                updatedRequest = data
                requestError = error
            }

            if (requestError || !updatedRequest) {
                const apiError = requestError as { code?: string; message?: string } | undefined
                setErrorMessage(apiError?.message ?? '레슨 요청을 처리하지 못했습니다.')
                return
            }

            setRequest(updatedRequest)
            setModalType(action === 'accept' ? 'ACCEPTED' : 'REJECTED')
        } catch {
            setErrorMessage('서버에 연결할 수 없습니다.')
        } finally {
            setProcessingAction(null)
        }
    }

    const closeModal = () => {
        setModalType(null)
        router.push(matchingManagementHref)
    }

    return (
        <main className="flex-1 bg-background pt-16 md:pt-20">
            <section className="mx-auto w-full max-w-screen-xl px-margin-mobile py-xl md:px-margin-desktop">
                <div className="flex flex-wrap items-start justify-between gap-sm">
                    <div>
                        <Link
                            href={matchingManagementHref}
                            className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            매칭 관리로 돌아가기
                        </Link>
                        <h1 className="mt-sm font-headline-md text-headline-md text-on-surface">
                            레슨 요청 상세 내역
                        </h1>
                        <p className="mt-xs text-body-md text-on-surface-variant">
                            {isTrainer
                                ? '요청 내용을 검토하고 일정을 확정해 주세요.'
                                : '보낸 요청 내용과 처리 상태를 확인할 수 있습니다.'}
                        </p>
                    </div>
                    {request?.status && <StatusBadge status={request.status} />}
                </div>

                {isLoading ? (
                    <SkeletonDetail />
                ) : errorMessage && !request ? (
                    <PageMessage icon="error" title={errorMessage} />
                ) : request ? (
                    <div className="mt-lg grid grid-cols-1 items-start gap-md lg:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="space-y-md">
                            <ParticipantProfileCard request={request} showTrainer={!isTrainer} />
                            <RequestSummary request={request} />
                            <CustomerMessage message={request.message} isSender={!isTrainer} />
                        </div>
                        <SchedulePanel
                            request={request}
                            canManage={isTrainer}
                            processingAction={processingAction}
                            errorMessage={errorMessage}
                            onAccept={() => void handleRequestAction('accept')}
                            onReject={() => void handleRequestAction('reject')}
                        />
                    </div>
                ) : null}
            </section>

            {modalType && <ResultModal type={modalType} onConfirm={closeModal} />}
        </main>
    )
}

function ParticipantProfileCard({
    request,
    showTrainer,
}: {
    request: LessonRequest
    showTrainer: boolean
}) {
    const name = showTrainer ? request.trainerName : request.memberName
    const profileImage = showTrainer ? request.trainerProfileImage : request.memberProfileImage

    return (
        <section className="flex flex-col items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md sm:flex-row sm:items-start">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-surface-container-lowest bg-surface-container shadow-sm">
                {profileImage ? (
                    <img
                        src={getImageUrl(profileImage)}
                        alt={`${name ?? '회원'} 프로필`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">
                            person
                        </span>
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    {name ?? (showTrainer ? '트레이너' : '회원')}
                    {!showTrainer && ' 회원님'}
                </h2>
                <p className="mt-xs text-body-md text-on-surface-variant">
                    {showTrainer
                        ? `${request.sports ?? '운동'} 레슨을 담당하는 트레이너입니다.`
                        : request.memberIntroduction ||
                          `${request.sports ?? '운동'} 레슨을 요청한 회원입니다.`}
                </p>
                <div className="mt-sm flex flex-wrap justify-center gap-xs sm:justify-start">
                    <InfoChip icon="location_on">지역: {request.region ?? '-'}</InfoChip>
                    <InfoChip icon="fitness_center">선호 종목: {request.sports ?? '-'}</InfoChip>
                </div>
            </div>
        </section>
    )
}

function RequestSummary({ request }: { request: LessonRequest }) {
    const items = [
        { icon: 'sports_gymnastics', label: '운동 종목', value: request.sports },
        { icon: 'groups', label: '레슨 유형', value: formatLessonType(request.lessonType) },
        { icon: 'trending_up', label: '레슨 수준', value: request.lessonLevel },
        {
            icon: 'confirmation_number',
            label: '수강 유형',
            value:
                request.lessonPassType === 'REGULAR'
                    ? `정기권 (주 ${request.weeklyCount ?? '-'}회)`
                    : '1회성',
        },
        {
            icon: 'payments',
            label: '제안 금액 (1회 기준)',
            value: request.price ? `${request.price.toLocaleString('ko-KR')}원` : '-',
        },
    ]

    return (
        <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
            <h2 className="flex items-center gap-xs font-headline-sm text-headline-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                요청 요약
            </h2>
            <dl className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
                {items.map((item) => (
                    <div key={item.label} className="flex items-start gap-sm">
                        <span className="material-symbols-outlined rounded-lg bg-secondary-container p-xs text-on-secondary-container">
                            {item.icon}
                        </span>
                        <div>
                            <dt className="text-label-sm text-on-surface-variant">{item.label}</dt>
                            <dd className="mt-1 text-body-lg font-medium text-on-surface">
                                {item.value ?? '-'}
                            </dd>
                        </div>
                    </div>
                ))}
            </dl>
        </section>
    )
}

function CustomerMessage({ message, isSender }: { message?: string; isSender: boolean }) {
    return (
        <section className="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
            <span className="absolute inset-y-0 left-0 w-1 bg-primary" />
            <h2 className="flex items-center gap-xs font-headline-sm text-headline-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                {isSender ? '보낸 메시지' : '고객의 메시지'}
            </h2>
            <p className="mt-sm rounded-lg bg-surface-container-low p-sm text-body-md leading-7 text-on-surface">
                {message ? `“${message}”` : '전달된 메시지가 없습니다.'}
            </p>
        </section>
    )
}

function SchedulePanel({
    request,
    canManage,
    processingAction,
    errorMessage,
    onAccept,
    onReject,
}: {
    request: LessonRequest
    canManage: boolean
    processingAction: 'accept' | 'reject' | null
    errorMessage: string
    onAccept: () => void
    onReject: () => void
}) {
    const pending = request.status === 'PENDING'
    const schedules =
        request.schedules && request.schedules.length > 0
            ? request.schedules
            : [
                  {
                      scheduleId: undefined,
                      requestedDate: request.requestedDate,
                      startTime: request.requestedStartTime,
                      endTime: request.requestedEndTime,
                  },
              ]

    return (
        <aside className="rounded-lg border border-primary/20 bg-surface-container-lowest p-md lg:sticky lg:top-24">
            <h2 className="flex items-center gap-xs font-headline-sm text-headline-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">event_available</span>
                제안된 일정
            </h2>

            <div className="mt-xs">
                <span className="inline-flex rounded-full bg-secondary-container px-xs py-1 text-label-sm text-on-secondary-container">
                    {request.lessonPassType === 'REGULAR'
                        ? `정기권 (주 ${request.weeklyCount ?? '-'}회)`
                        : '1회성'}
                </span>
            </div>

            <RequestCalendar
                requestedDates={schedules
                    .map((schedule) => schedule.requestedDate)
                    .filter((date): date is string => Boolean(date))}
            />

            <div className="mt-md space-y-xs">
                {schedules.map((schedule, index) => (
                    <div
                        key={
                            schedule.scheduleId ??
                            `${schedule.requestedDate}-${schedule.startTime}-${index}`
                        }
                        className="rounded-lg border border-outline-variant bg-surface-container-low p-sm"
                    >
                        <div className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary">schedule</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-label-bold text-on-surface">
                                    {getRequestedDayLabel(schedule.requestedDate)}
                                </p>
                                <p className="text-label-sm text-on-surface-variant">
                                    {formatDate(schedule.requestedDate)} 시작
                                </p>
                            </div>
                            <strong className="whitespace-nowrap text-body-md text-on-surface">
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </strong>
                        </div>
                    </div>
                ))}
            </div>

            {errorMessage && (
                <p className="mt-sm rounded-lg bg-error-container p-sm text-body-sm text-on-error-container">
                    {errorMessage}
                </p>
            )}

            {pending && canManage ? (
                <div className="mt-md space-y-xs">
                    <button
                        type="button"
                        onClick={onAccept}
                        disabled={processingAction !== null}
                        className="flex h-12 w-full items-center justify-center gap-xs rounded-lg bg-primary font-label-bold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-outline-variant"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        {processingAction === 'accept'
                            ? '수락 처리 중...'
                            : '수락하고 스케줄 확정하기'}
                    </button>
                    <button
                        type="button"
                        onClick={onReject}
                        disabled={processingAction !== null}
                        className="flex h-12 w-full items-center justify-center gap-xs rounded-lg border border-outline bg-surface-container-lowest font-label-bold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">cancel</span>
                        {processingAction === 'reject' ? '거절 처리 중...' : '요청 거절하기'}
                    </button>
                </div>
            ) : pending ? (
                <p className="mt-md rounded-lg bg-surface-container-low p-sm text-center font-label-bold text-on-surface-variant">
                    트레이너의 답변을 기다리고 있습니다.
                </p>
            ) : request.status === 'ACCEPTED' && !canManage ? (
                <button
                    type="button"
                    onClick={() => startPayment(request.lessonRequestId!)}
                    className="mt-md flex h-12 w-full items-center justify-center gap-xs rounded-lg bg-primary font-label-bold text-on-primary transition-colors hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">payments</span>
                    결제하기
                </button>
            ) : (
                <p className="mt-md rounded-lg bg-surface-container-low p-sm text-center font-label-bold text-on-surface-variant">
                    {getProcessedRequestMessage(request.status)}
                </p>
            )}
        </aside>
    )
}

function getProcessedRequestMessage(status?: LessonRequestStatus) {
    if (status === 'ACCEPTED') return '결제 대기 중인 요청입니다.'
    if (status === 'REJECTED') return '이미 거절된 요청입니다.'
    if (status === 'CANCELED') return '이미 취소된 요청입니다.'
    if (status === 'COMPLETED') return '결제가 완료된 레슨입니다.'
    return '이미 처리된 요청입니다.'
}

function RequestCalendar({ requestedDates }: { requestedDates: string[] }) {
    const selectedDates = useMemo(
        () => requestedDates.map((date) => new Date(`${date}T00:00:00`)),
        [requestedDates]
    )
    const selectedDate = selectedDates[0] ?? null

    if (!selectedDate) {
        return null
    }

    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDayIndex = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    const days: Array<Date | null> = [
        ...Array.from({ length: firstDayIndex }, () => null),
        ...Array.from({ length: lastDate }, (_, index) => new Date(year, month, index + 1)),
    ]

    return (
        <div className="mt-md rounded-lg bg-surface-container-low p-sm">
            <strong className="text-body-md text-on-surface">
                {year}년 {month + 1}월
            </strong>
            <div className="mt-sm grid grid-cols-7 text-center text-label-sm text-outline">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <span key={day} className="py-xs">
                        {day}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((date, index) =>
                    date ? (
                        <span
                            key={date.toISOString()}
                            className={`flex aspect-square items-center justify-center rounded-md text-body-sm ${
                                selectedDates.some(
                                    (selected) =>
                                        selected.getFullYear() === date.getFullYear() &&
                                        selected.getMonth() === date.getMonth() &&
                                        selected.getDate() === date.getDate()
                                )
                                    ? 'bg-primary font-semibold text-on-primary'
                                    : 'text-on-surface'
                            }`}
                        >
                            {date.getDate()}
                        </span>
                    ) : (
                        <span key={`empty-${index}`} className="aspect-square" />
                    )
                )}
            </div>
        </div>
    )
}

function ResultModal({
    type,
    onConfirm,
}: {
    type: Exclude<ResultModalType, null>
    onConfirm: () => void
}) {
    const accepted = type === 'ACCEPTED'

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/45 p-md backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lesson-result-title"
        >
            <div
                className="overflow-hidden rounded-lg bg-surface-container-lowest p-md text-center shadow-2xl md:p-lg"
                style={{ width: 'min(calc(100vw - 32px), 448px)' }}
            >
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                        accepted ? 'bg-primary-fixed text-primary' : 'bg-error-container text-error'
                    }`}
                >
                    <span className="material-symbols-outlined text-4xl">
                        {accepted ? 'check_circle' : 'cancel'}
                    </span>
                </div>
                <h2
                    id="lesson-result-title"
                    className="mt-md break-keep font-headline-md text-headline-md text-on-surface"
                >
                    {accepted ? '스케줄이 확정되었습니다!' : '요청을 거절했습니다.'}
                </h2>
                <p className="mt-xs break-keep text-body-md leading-7 text-on-surface-variant">
                    {accepted
                        ? '레슨 요청 상태가 수락으로 변경되었습니다. 첫 레슨 준비를 시작해 보세요.'
                        : '해당 요청을 거절 처리했습니다. 다른 회원의 요청을 확인해 보세요.'}
                </p>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="mt-md h-12 w-full rounded-lg bg-primary font-label-bold text-on-primary transition-colors hover:bg-primary/90"
                >
                    확인
                </button>
            </div>
        </div>
    )
}

function InfoChip({ icon, children }: { icon: string; children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-xs py-1 text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-base">{icon}</span>
            {children}
        </span>
    )
}

function StatusBadge({ status }: { status: LessonRequestStatus }) {
    const className =
        status === 'ACCEPTED'
            ? 'bg-primary-fixed text-primary'
            : status === 'REJECTED' || status === 'CANCELED'
              ? 'bg-error-container text-on-error-container'
              : 'bg-primary text-on-primary'

    return (
        <span className={`rounded-full px-sm py-xs text-label-sm ${className}`}>
            {STATUS_LABELS[status]}
        </span>
    )
}

function PageMessage({ icon, title }: { icon: string; title: string }) {
    return (
        <div className="mt-lg flex min-h-80 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-center">
            <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
            <h2 className="mt-sm font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        </div>
    )
}

function getRequestedDayLabel(date?: string) {
    if (!date) return '요청 일정'
    return DAY_LABELS[new Date(`${date}T00:00:00`).getDay()]
}

function Bone({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-surface-container ${className}`} />
}

function SkeletonDetail() {
    return (
        <div className="mt-lg grid grid-cols-1 items-start gap-md lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* 왼쪽 */}
            <div className="space-y-md">
                {/* 프로필 카드 */}
                <div className="flex flex-col items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md sm:flex-row sm:items-start">
                    <Bone className="h-24 w-24 shrink-0 rounded-full" />
                    <div className="w-full space-y-sm">
                        <Bone className="h-7 w-40" />
                        <Bone className="h-4 w-full max-w-xs" />
                        <div className="flex gap-xs">
                            <Bone className="h-6 w-24 rounded-full" />
                            <Bone className="h-6 w-28 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* 요청 요약 */}
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
                    <Bone className="mb-md h-6 w-24" />
                    <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-sm">
                                <Bone className="h-9 w-9 rounded-lg" />
                                <div className="space-y-1">
                                    <Bone className="h-3 w-16" />
                                    <Bone className="h-5 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 메시지 */}
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
                    <Bone className="mb-sm h-6 w-28" />
                    <Bone className="h-16 w-full rounded-lg" />
                </div>
            </div>

            {/* 오른쪽 일정 패널 */}
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md space-y-md">
                <Bone className="h-6 w-28" />
                <Bone className="h-6 w-20 rounded-full" />
                {/* 캘린더 */}
                <div className="rounded-lg bg-surface-container-low p-sm">
                    <Bone className="mb-sm h-5 w-20" />
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <Bone key={i} className="aspect-square rounded-md" />
                        ))}
                    </div>
                </div>
                {/* 시간 */}
                <Bone className="h-14 w-full rounded-lg" />
                {/* 버튼 */}
                <Bone className="h-12 w-full rounded-lg" />
            </div>
        </div>
    )
}
