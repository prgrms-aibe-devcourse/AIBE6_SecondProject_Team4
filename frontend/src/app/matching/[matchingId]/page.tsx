'use client'

import MatchingResultCard from '@/components/matching/MatchingResultCard'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

type MatchingResult = components['schemas']['MatchingResultResponse']

type MatchingRequestSummary = {
    sports: string
    level: string
    lessonType: string
    region: string
    district: string
    budgetMin: number
    budgetMax: number
}

export default function MatchingResultPage() {
    const { matchingId } = useParams<{ matchingId: string }>()
    const router = useRouter()
    const [results, setResults] = useState<MatchingResult[]>([])
    const [summary, setSummary] = useState<MatchingRequestSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!matchingId) {
            return
        }

        const storedSummary = sessionStorage.getItem(`matching-request-${matchingId}`)

        if (storedSummary) {
            try {
                setSummary(JSON.parse(storedSummary) as MatchingRequestSummary)
            } catch {
                sessionStorage.removeItem(`matching-request-${matchingId}`)
            }
        }

        const loadResults = async () => {
            try {
                const client = getAuthClient()
                const { data, error } = await client.GET('/api/matching/{matchingId}/results', {
                    params: {
                        path: {
                            matchingId: Number(matchingId),
                        },
                    },
                })

                if (error || !data) {
                    setErrorMessage('추천 결과를 불러오지 못했습니다.')
                    return
                }

                setResults(data)
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadResults()
    }, [matchingId])

    const handleLessonRequest = (matchingResultId: number) => {
        router.push(`/lesson-requests/new/${matchingId}/${matchingResultId}`)
    }

    return (
        <main className="pt-16 md:pt-20">
            <section className="mx-auto max-w-screen-xl px-margin-mobile py-xl md:px-margin-desktop">
                <div className="flex flex-col gap-sm rounded-lg bg-surface-container-low p-md md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-label-md text-on-surface-variant">입력하신 검색 조건</p>
                        <p className="mt-xs font-headline-sm text-headline-sm text-on-surface">
                            {summary
                                ? [
                                      summary.sports,
                                      summary.level,
                                      `${summary.region} ${summary.district}`,
                                      summary.lessonType,
                                  ].join(' · ')
                                : `매칭 요청 #${matchingId}`}
                        </p>
                    </div>
                    <Link
                        href="/matching"
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-sm font-label-bold text-on-surface hover:border-primary hover:text-primary cursor-pointer"
                    >
                        조건 수정
                    </Link>
                </div>

                <div className="mt-xl">
                    <p className="text-label-md font-label-bold text-primary">AI MATCHING</p>
                    <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">
                        AI가 조건에 맞는 트레이너를 찾았습니다
                    </h1>
                    <p className="mt-xs text-body-md text-on-surface-variant">
                        요청 조건과 가능한 시간이 겹치는 트레이너를 보여드립니다.
                    </p>
                </div>

                {isLoading ? (
                    <SkeletonCards />
                ) : errorMessage ? (
                    <ResultMessage
                        icon="error"
                        title={errorMessage}
                        description="잠시 후 다시 시도하거나 조건 입력 페이지로 돌아가 주세요."
                    />
                ) : results.length === 0 ? (
                    <ResultMessage
                        icon="person_search"
                        title="조건에 맞는 트레이너가 없습니다."
                        description="시간대나 지역, 예산 조건을 조금 넓히면 더 많은 트레이너를 만날 수 있습니다."
                    />
                ) : (
                    <div className="mt-lg grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-3">
                        {results.map((result) => (
                            <MatchingResultCard
                                key={result.matchingResultId}
                                result={result}
                                onLessonRequest={handleLessonRequest}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

function Bone({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded bg-surface-container ${className ?? ''}`} />
}

function SkeletonCards() {
    return (
        <div className="mt-lg grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                    {/* 이미지 영역 */}
                    <Bone className="aspect-[4/3] w-full rounded-none" />
                    <div className="p-md space-y-md">
                        {/* 이름 + 순위 배지 */}
                        <div className="flex items-start justify-between gap-sm">
                            <div className="space-y-xs flex-1">
                                <Bone className="h-6 w-32" />
                                <div className="flex gap-1.5">
                                    <Bone className="h-5 w-14 rounded-full" />
                                    <Bone className="h-5 w-16 rounded-full" />
                                    <Bone className="h-5 w-12 rounded-full" />
                                </div>
                            </div>
                            <Bone className="h-6 w-20 rounded-full" />
                        </div>
                        {/* 소개 */}
                        <div className="space-y-xs">
                            <Bone className="h-4 w-full" />
                            <Bone className="h-4 w-4/5" />
                            <Bone className="h-4 w-3/5" />
                        </div>
                        {/* 추천이유 */}
                        <Bone className="h-16 w-full rounded-lg" />
                        {/* 요일/시간 */}
                        <Bone className="h-14 w-full rounded-lg" />
                        {/* 가격 */}
                        <div className="border-t border-outline-variant pt-md space-y-xs">
                            <Bone className="h-3 w-16" />
                            <Bone className="h-7 w-28" />
                        </div>
                        {/* 버튼 */}
                        <div className="grid grid-cols-2 gap-xs">
                            <Bone className="h-11 rounded-lg" />
                            <Bone className="h-11 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

type ResultMessageProps = {
    icon: string
    title: string
    description?: string
    showAction?: boolean
}

function ResultMessage({ icon, title, description, showAction = true }: ResultMessageProps) {
    return (
        <div className="mt-lg flex min-h-80 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-md text-center">
            <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
            <h2 className="mt-md font-headline-sm text-headline-sm text-on-surface">{title}</h2>
            {description && (
                <p
                    className="mt-xs text-body-md text-on-surface-variant"
                    style={{ width: '100%', maxWidth: '32rem' }}
                >
                    {description}
                </p>
            )}
            {showAction && (
                <Link
                    href="/matching"
                    className="mt-md inline-flex h-11 items-center justify-center rounded-lg border border-primary px-md font-label-bold text-primary hover:bg-primary-fixed cursor-pointer"
                >
                    조건 다시 입력하기
                </Link>
            )}
        </div>
    )
}
