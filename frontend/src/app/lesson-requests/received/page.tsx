'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

type LessonRequest = components['schemas']['LessonRequestResponse']
type LessonRequestStatus = NonNullable<LessonRequest['status']>
type FilterStatus = 'ALL' | LessonRequestStatus

const STATUS_LABELS: Record<LessonRequestStatus, string> = {
    PENDING: '답변 대기',
    ACCEPTED: '수락됨',
    REJECTED: '거절됨',
    CANCELED: '취소됨',
}

const FILTERS: Array<{ value: FilterStatus; label: string }> = [
    { value: 'ALL', label: '전체' },
    { value: 'PENDING', label: '대기 중' },
    { value: 'ACCEPTED', label: '수락됨' },
    { value: 'REJECTED', label: '거절됨' },
]

const formatDate = (date?: string) => {
    if (!date) return '-'
    return new Date(`${date}T00:00:00`).toLocaleDateString('ko-KR')
}

export default function ReceivedLessonRequestsPage() {
    const { user } = useAuth()
    const [requests, setRequests] = useState<LessonRequest[]>([])
    const [filter, setFilter] = useState<FilterStatus>('ALL')
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const status = new URLSearchParams(window.location.search).get('status')

        if (status && FILTERS.some((filterItem) => filterItem.value === status)) {
            setFilter(status as FilterStatus)
        }
    }, [])

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const client = getAuthClient()
                const { data, error } = await client.GET('/api/trainers/me/lesson-requests')

                if (error || !data) {
                    setErrorMessage('받은 레슨 요청을 불러오지 못했습니다.')
                    return
                }

                setRequests(data)
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadRequests()
    }, [])

    const filteredRequests = useMemo(
        () =>
            filter === 'ALL' ? requests : requests.filter((request) => request.status === filter),
        [filter, requests]
    )

    if (user && user.role !== 'TRAINER') {
        return (
            <main className="flex-1 bg-background pt-16 md:pt-20">
                <PageMessage icon="lock" title="트레이너만 받은 요청을 확인할 수 있습니다." />
            </main>
        )
    }

    return (
        <main className="flex-1 bg-background pt-16 md:pt-20">
            <section className="mx-auto w-full max-w-screen-xl px-margin-mobile py-xl md:px-margin-desktop">
                <div>
                    <Link
                        href="/mypage?tab=matching"
                        className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        마이페이지로 돌아가기
                    </Link>
                    <h1 className="mt-sm font-headline-md text-headline-md text-on-surface">
                        받은 레슨 요청
                    </h1>
                    <p className="mt-xs text-body-md text-on-surface-variant">
                        회원이 보낸 레슨 요청을 확인하고 처리해 주세요.
                    </p>
                </div>

                <div className="mt-lg flex gap-xs border-b border-outline-variant">
                    {FILTERS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setFilter(value)}
                            className={`border-b-2 px-sm py-sm text-body-sm transition-colors ${
                                filter === value
                                    ? 'border-primary font-semibold text-primary'
                                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <PageMessage icon="progress_activity" title="요청 목록을 불러오는 중입니다." />
                ) : errorMessage ? (
                    <PageMessage icon="error" title={errorMessage} />
                ) : filteredRequests.length === 0 ? (
                    <PageMessage icon="inbox" title="해당하는 레슨 요청이 없습니다." />
                ) : (
                    <div className="mt-md space-y-sm">
                        {filteredRequests.map((request) => (
                            <LessonRequestItem key={request.lessonRequestId} request={request} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

function LessonRequestItem({ request }: { request: LessonRequest }) {
    const status = request.status ?? 'PENDING'

    return (
        <article className="flex flex-col gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-sm">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface-container">
                    {request.memberProfileImage ? (
                        <img
                            src={getImageUrl(request.memberProfileImage)}
                            alt={`${request.memberName ?? '회원'} 프로필`}
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

                <div className="min-w-0">
                    <h2 className="truncate font-headline-sm text-headline-sm text-on-surface">
                        {request.memberName ?? '회원'}
                    </h2>
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                        요청일 {formatDate(request.requestedDate)}
                    </p>
                    <div className="mt-xs flex flex-wrap gap-xs">
                        {[request.sports, request.lessonType, request.region]
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

            <div className="flex items-center justify-between gap-sm md:justify-end">
                <StatusBadge status={status} />
                {request.lessonRequestId && (
                    <Link
                        href={`/lesson-requests/${request.lessonRequestId}`}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-md font-label-bold text-on-primary transition-colors hover:bg-primary/90"
                    >
                        상세 보기
                    </Link>
                )}
            </div>
        </article>
    )
}

function StatusBadge({ status }: { status: LessonRequestStatus }) {
    const className =
        status === 'ACCEPTED'
            ? 'bg-primary-fixed text-primary'
            : status === 'REJECTED' || status === 'CANCELED'
              ? 'bg-error-container text-on-error-container'
              : 'bg-surface-container-high text-on-surface-variant'

    return (
        <span className={`shrink-0 rounded-full px-sm py-xs text-label-sm ${className}`}>
            {STATUS_LABELS[status]}
        </span>
    )
}

function PageMessage({ icon, title }: { icon: string; title: string }) {
    return (
        <div className="mx-auto mt-lg flex min-h-72 max-w-screen-xl flex-col items-center justify-center px-margin-mobile text-center md:px-margin-desktop">
            <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
            <h2 className="mt-sm font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        </div>
    )
}
