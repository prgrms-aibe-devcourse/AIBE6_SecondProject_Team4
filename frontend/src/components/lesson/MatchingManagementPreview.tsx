'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

type ApiLessonRequest = components['schemas']['LessonRequestResponse']
type LessonRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'COMPLETED'
type LessonRequest = Omit<ApiLessonRequest, 'status'> & {
    status?: LessonRequestStatus
}
type FilterStatus = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

const PAGE_SIZE = 5

const FILTERS: Array<{ value: FilterStatus; label: string }> = [
    { value: 'ALL', label: '전체' },
    { value: 'PENDING', label: '대기 중' },
    { value: 'ACCEPTED', label: '수락됨' },
    { value: 'REJECTED', label: '거절됨' },
    { value: 'COMPLETED', label: '매칭 완료' },
]

const STATUS_STYLE: Record<LessonRequestStatus, string> = {
    PENDING: 'bg-[#eef0f8] text-[#5f6472]',
    ACCEPTED: 'bg-[#dbeafe] text-[#0057cd]',
    REJECTED: 'bg-[#ffe2df] text-[#ba1a1a]',
    CANCELED: 'bg-surface-container text-outline',
    COMPLETED: 'bg-[#d9f3e8] text-[#006b54]',
}

const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return '-'
    return new Date(dateTime).toLocaleDateString('ko-KR')
}

const formatTime = (time?: string) => time?.slice(0, 5) ?? '-'

export default function MatchingManagementPreview() {
    const { user } = useAuth()
    const [requests, setRequests] = useState<LessonRequest[]>([])
    const [filter, setFilter] = useState<FilterStatus>('ALL')
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const isTrainer = user?.role === 'TRAINER'

    useEffect(() => {
        if (!user) return

        const loadRequests = async () => {
            setIsLoading(true)
            setErrorMessage('')

            try {
                const client = getAuthClient()
                const { data, error } = isTrainer
                    ? await client.GET('/api/trainers/me/lesson-requests')
                    : await client.GET('/api/members/me/lesson-requests')

                if (error || !data) {
                    setErrorMessage('레슨 요청 내역을 불러오지 못했습니다.')
                    return
                }

                setRequests(data as LessonRequest[])
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadRequests()
    }, [isTrainer, user])

    const sortedRequests = useMemo(
        () => [...requests].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
        [requests]
    )

    const statusCounts = useMemo(
        () =>
            sortedRequests.reduce<Record<Exclude<FilterStatus, 'ALL'>, number>>(
                (counts, request) => {
                    if (request.status && request.status !== 'CANCELED') {
                        counts[request.status] += 1
                    }
                    return counts
                },
                {
                    PENDING: 0,
                    ACCEPTED: 0,
                    REJECTED: 0,
                    COMPLETED: 0,
                }
            ),
        [sortedRequests]
    )

    const filteredRequests = useMemo(
        () =>
            filter === 'ALL'
                ? sortedRequests
                : sortedRequests.filter((request) => request.status === filter),
        [filter, sortedRequests]
    )

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))
    const visibleRequests = filteredRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    useEffect(() => {
        setPage(1)
    }, [filter])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    return (
        <section className="space-y-lg">
            <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                    매칭 관리 상세 목록
                </h2>
                <p className="mt-xs text-body-md text-on-surface-variant">
                    {isTrainer
                        ? '회원에게 들어온 레슨 요청을 상태별로 확인하고 관리하세요.'
                        : '트레이너에게 보낸 레슨 요청과 결제 진행 상태를 확인하세요.'}
                </p>
            </div>

            <div className="overflow-x-auto border-b border-outline-variant">
                <div className="flex min-w-max gap-xs">
                    {FILTERS.map(({ value, label }) => {
                        const count =
                            value === 'ALL' ? sortedRequests.length : statusCounts[value]

                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFilter(value)}
                                className={`flex h-12 items-center gap-2 border-b-2 px-sm text-body-sm transition-colors ${
                                    filter === value
                                        ? 'border-primary font-semibold text-primary'
                                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                {label}
                                <span
                                    className={`rounded-full px-2 py-0.5 text-label-sm ${
                                        filter === value
                                            ? 'bg-primary-fixed text-primary'
                                            : 'bg-surface-container text-on-surface-variant'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {isLoading ? (
                <PageMessage icon="progress_activity" message="요청 목록을 불러오는 중입니다." />
            ) : errorMessage ? (
                <PageMessage icon="error" message={errorMessage} />
            ) : visibleRequests.length === 0 ? (
                <PageMessage
                    icon="inbox"
                    message={
                        filter === 'ALL'
                            ? '아직 레슨 요청 내역이 없습니다.'
                            : '해당 상태의 레슨 요청이 없습니다.'
                    }
                />
            ) : (
                <div className="space-y-sm">
                    {visibleRequests.map((request) => (
                        <LessonRequestCard
                            key={request.lessonRequestId}
                            request={request}
                            isTrainer={isTrainer}
                        />
                    ))}
                </div>
            )}

            {!isLoading && !errorMessage && filteredRequests.length > PAGE_SIZE && (
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
        </section>
    )
}

function LessonRequestCard({
    request,
    isTrainer,
}: {
    request: LessonRequest
    isTrainer: boolean
}) {
    const status = request.status ?? 'PENDING'
    const name = isTrainer ? request.memberName : request.trainerName
    const profileImage = isTrainer
        ? request.memberProfileImage
        : request.trainerProfileImage

    return (
        <article
            className="flex flex-col gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:flex-row md:items-center"
            style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
        >
            <div className="flex min-w-0 flex-1 items-start gap-sm">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-container">
                    {profileImage ? (
                        <img
                            src={getImageUrl(profileImage)}
                            alt={`${name ?? '회원'} 프로필`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-outline">
                                person
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">
                        {name ?? (isTrainer ? '회원' : '트레이너')}
                    </h3>

                    <p className="mt-1 text-label-sm text-on-surface-variant">
                        요청일 {formatDateTime(request.createdAt)}
                    </p>

                    <div className="mt-xs flex flex-wrap gap-xs">
                        {[request.sports, request.lessonType, request.lessonLevel, request.region]
                            .filter((value): value is string => Boolean(value))
                            .map((value) => (
                                <span
                                    key={value}
                                    className="rounded-full bg-primary-fixed px-xs py-1 text-label-sm text-on-primary-fixed"
                                >
                                    {value}
                                </span>
                            ))}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-sm border-t border-outline-variant pt-sm md:border-t-0 md:pt-0">
                <StatusBadge status={status} />
                {request.lessonRequestId && (
                    <Link
                        href={`/lesson-requests/${request.lessonRequestId}`}
                        className="flex h-11 min-w-32 items-center justify-center rounded-lg bg-primary px-md font-label-bold text-on-primary transition-colors hover:bg-primary/90"
                    >
                        상세보기
                    </Link>
                )}
            </div>
        </article>
    )
}

function StatusBadge({ status }: { status: LessonRequestStatus }) {
    const label = {
        PENDING: '대기 중',
        ACCEPTED: '수락됨',
        REJECTED: '거절됨',
        CANCELED: '취소됨',
        COMPLETED: '매칭 완료',
    }[status]

    return (
        <span
            className={`whitespace-nowrap rounded-full px-sm py-xs font-label-bold ${STATUS_STYLE[status]}`}
        >
            {label}
        </span>
    )
}

function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number
    totalPages: number
    onChange: (page: number) => void
}) {
    return (
        <nav className="flex items-center justify-center gap-xs" aria-label="매칭 요청 페이지">
            <button
                type="button"
                aria-label="이전 페이지"
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                    key={pageNumber}
                    type="button"
                    onClick={() => onChange(pageNumber)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-label-bold transition-colors ${
                        page === pageNumber
                            ? 'bg-primary text-on-primary'
                            : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                type="button"
                aria-label="다음 페이지"
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </nav>
    )
}

function PageMessage({ icon, message }: { icon: string; message: string }) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest px-md text-center">
            <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
            <p className="mt-sm text-body-md text-on-surface-variant">{message}</p>
        </div>
    )
}
