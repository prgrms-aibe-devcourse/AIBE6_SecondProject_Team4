'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

type LessonRequest = components['schemas']['LessonRequestResponse']

export default function MatchingManagementPreview() {
    const { user } = useAuth()
    const [requests, setRequests] = useState<LessonRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!user) return

        const loadRequests = async () => {
            try {
                const client = getAuthClient()
                const { data, error } =
                    user.role === 'TRAINER'
                        ? await client.GET('/api/trainers/me/lesson-requests')
                        : await client.GET('/api/members/me/lesson-requests')

                if (error || !data) {
                    setErrorMessage('요청 내역을 불러오지 못했습니다.')
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
    }, [user])

    const sortedRequests = useMemo(
        () => [...requests].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
        [requests]
    )

    const sentRequests = user?.role === 'TRAINER' ? [] : sortedRequests
    const pendingRequests =
        user?.role === 'TRAINER'
            ? sortedRequests.filter((request) => request.status === 'PENDING')
            : []
    const acceptedRequests = sortedRequests.filter(
        (request) => request.status === 'ACCEPTED' || request.status === 'COMPLETED'
    )
    const counterpart = user?.role === 'TRAINER' ? 'member' : 'trainer'

    return (
        <section className="space-y-md">
            <h2 className="text-headline-sm font-headline-sm text-on-surface">매칭 관리</h2>

            <div className="grid grid-cols-1 gap-md md:grid-cols-3">
                <ManagementCard
                    icon="outgoing_mail"
                    title="보낸 요청"
                    tone="primary"
                    count={sentRequests.length}
                >
                    <RequestList
                        requests={sentRequests}
                        counterpart="trainer"
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        emptyMessage={
                            user?.role === 'TRAINER'
                                ? '일반 회원 계정에서 보낸 요청을 확인할 수 있습니다.'
                                : '보낸 요청이 없습니다.'
                        }
                    />
                    {user?.role === 'TRAINER' ? (
                        <span className="block w-full py-2 text-center font-label-bold text-outline">
                            모든 요청 보기
                        </span>
                    ) : (
                        <Link
                            href="/lesson-requests/sent"
                            className="block w-full py-2 text-center font-label-bold text-primary hover:underline"
                        >
                            모든 요청 보기
                        </Link>
                    )}
                </ManagementCard>

                <ManagementCard
                    icon="inbox"
                    title="받은 요청"
                    tone="tertiary"
                    count={pendingRequests.length}
                >
                    <RequestList
                        requests={pendingRequests}
                        counterpart="member"
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        emptyMessage={
                            user?.role === 'TRAINER'
                                ? '대기 중인 레슨 요청이 없습니다.'
                                : '트레이너 계정에서 받은 요청을 확인할 수 있습니다.'
                        }
                    />
                    {user?.role === 'TRAINER' ? (
                        <Link
                            href="/lesson-requests/received?status=PENDING"
                            className="block w-full py-2 text-center font-label-bold text-primary hover:underline"
                        >
                            수신함 관리
                        </Link>
                    ) : (
                        <span className="block w-full py-2 text-center font-label-bold text-outline">
                            트레이너 전용
                        </span>
                    )}
                </ManagementCard>

                <ManagementCard
                    icon="verified"
                    title="매칭 완료 내역"
                    tone="secondary"
                    count={acceptedRequests.length}
                >
                    <RequestList
                        requests={acceptedRequests}
                        counterpart={counterpart}
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        emptyMessage={
                            user?.role === 'TRAINER'
                                ? '수락 완료된 레슨 요청이 없습니다.'
                                : '완료된 매칭 내역이 없습니다.'
                        }
                    />
                    <Link
                        href={
                            user?.role === 'TRAINER'
                                ? '/lesson-requests/received?status=ACCEPTED'
                                : '/lesson-requests/sent?status=ACCEPTED'
                        }
                        className="block w-full py-2 text-center font-label-bold text-primary hover:underline"
                    >
                        히스토리 보기
                    </Link>
                </ManagementCard>
            </div>
        </section>
    )
}

function ManagementCard({
    icon,
    title,
    tone,
    count,
    children,
}: {
    icon: string
    title: string
    tone: 'primary' | 'secondary' | 'tertiary'
    count?: number
    children: React.ReactNode
}) {
    const toneClass = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        tertiary: 'text-tertiary',
    }[tone]

    return (
        <article
            className="flex min-h-72 flex-col gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md"
            style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
        >
            <div className={`flex items-center gap-sm ${toneClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
                <span className="text-label-bold">{title}</span>
                {typeof count === 'number' && count > 0 && (
                    <span className="ml-auto rounded-full bg-surface-container px-xs py-1 text-label-sm text-on-surface-variant">
                        {count}건
                    </span>
                )}
            </div>
            {children}
        </article>
    )
}

function RequestList({
    requests,
    counterpart,
    isLoading,
    errorMessage,
    emptyMessage,
}: {
    requests: LessonRequest[]
    counterpart: 'member' | 'trainer'
    isLoading: boolean
    errorMessage: string
    emptyMessage: string
}) {
    if (isLoading) {
        return <EmptyPreview message="요청 내역을 불러오는 중입니다." />
    }

    if (errorMessage) {
        return <EmptyPreview message={errorMessage} />
    }

    if (requests.length === 0) {
        return <EmptyPreview message={emptyMessage} />
    }

    return (
        <div className="max-h-52 flex-1 space-y-xs overflow-y-auto pr-1">
            {requests.map((request) => {
                const name = counterpart === 'trainer' ? request.trainerName : request.memberName
                const profileImage =
                    counterpart === 'trainer'
                        ? request.trainerProfileImage
                        : request.memberProfileImage

                return (
                    <Link
                        key={request.lessonRequestId}
                        href={`/lesson-requests/${request.lessonRequestId}`}
                        className="flex items-center gap-sm rounded-lg bg-surface-container-low p-sm transition-colors hover:bg-surface-container"
                    >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container">
                            {profileImage ? (
                                <img
                                    src={getImageUrl(profileImage)}
                                    alt={`${name ?? '회원'} 프로필`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl text-outline">
                                        person
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <strong className="block truncate text-body-md text-on-surface">
                                {name ?? (counterpart === 'trainer' ? '트레이너' : '회원')}
                            </strong>
                            <span className="block truncate text-label-sm text-on-surface-variant">
                                {[request.sports, request.lessonType].filter(Boolean).join(' · ')}
                            </span>
                        </div>
                        <span className="material-symbols-outlined shrink-0 text-xl text-primary">
                            chevron_right
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}

function EmptyPreview({ message }: { message: string }) {
    return (
        <div className="flex flex-1 items-center justify-center py-sm text-center">
            <p className="text-body-sm leading-6 text-secondary">{message}</p>
        </div>
    )
}
