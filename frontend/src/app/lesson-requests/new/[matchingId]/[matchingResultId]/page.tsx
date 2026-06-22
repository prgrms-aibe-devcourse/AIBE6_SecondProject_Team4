'use client'

import LessonRequestForm, {
    type LessonRequestSummary,
    type TrainerScheduleInfo,
} from '@/components/lesson/LessonRequestForm'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type MatchingResult = components['schemas']['MatchingResultResponse']
type Trainer = components['schemas']['TrainerProfileResponse']

export default function LessonRequestCreatePage() {
    const { matchingId, matchingResultId } = useParams<{
        matchingId: string
        matchingResultId: string
    }>()
    const [result, setResult] = useState<MatchingResult | null>(null)
    const [trainerSchedule, setTrainerSchedule] = useState<TrainerScheduleInfo | null>(null)
    const [summary, setSummary] = useState<LessonRequestSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!matchingId || !matchingResultId) {
            setErrorMessage('잘못된 레슨 요청 경로입니다.')
            setIsLoading(false)
            return
        }

        const storedSummary = sessionStorage.getItem(`matching-request-${matchingId}`)

        if (storedSummary) {
            try {
                setSummary(JSON.parse(storedSummary) as LessonRequestSummary)
            } catch {
                sessionStorage.removeItem(`matching-request-${matchingId}`)
            }
        }

        const loadMatchingResult = async () => {
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
                    setErrorMessage('선택한 매칭 결과를 불러오지 못했습니다.')
                    return
                }

                const selectedResult = data.find(
                    (item) => item.matchingResultId === Number(matchingResultId)
                )

                if (!selectedResult) {
                    setErrorMessage('선택한 트레이너의 매칭 결과가 존재하지 않습니다.')
                    return
                }

                setResult(selectedResult)

                const { data: trainer, error: trainerError } = await client.GET(
                    '/api/trainers/{id}',
                    {
                        params: {
                            path: {
                                id: selectedResult.trainerProfileId!,
                            },
                        },
                    }
                )

                if (trainerError || !trainer) {
                    setErrorMessage('트레이너의 가능 시간을 불러오지 못했습니다.')
                    return
                }

                setTrainerSchedule(toTrainerSchedule(trainer))
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadMatchingResult()
    }, [matchingId, matchingResultId])

    return (
        <main className="flex-1 bg-background pt-16 md:pt-20">
            <section className="mx-auto max-w-4xl px-margin-mobile py-xl md:px-margin-desktop">
                <div className="mb-md">
                    <p className="font-label-bold text-label-bold text-primary">LESSON REQUEST</p>
                    <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">
                        레슨 요청 작성
                    </h1>
                    <p className="mt-xs text-body-md text-on-surface-variant">
                        선택한 트레이너와 레슨 상세 일정을 확정해 주세요.
                    </p>
                </div>

                {isLoading ? (
                    <PageMessage icon="progress_activity" title="매칭 정보를 불러오는 중입니다." />
                ) : errorMessage ? (
                    <PageMessage icon="error" title={errorMessage} showAction />
                ) : result && trainerSchedule ? (
                    <LessonRequestForm
                        matchingResult={result}
                        matchedTrainer={trainerSchedule}
                        summary={summary}
                    />
                ) : null}
            </section>
        </main>
    )
}

function toTrainerSchedule(trainer: Trainer): TrainerScheduleInfo {
    return {
        trainerProfileId: trainer.id!,
        trainerName: trainer.nickname ?? '트레이너',
        profileImage: trainer.profileImage,
        sports: trainer.sports,
        lessonType: trainer.lessonType,
        lessonLevel: trainer.lessonLevel,
        price: trainer.price,
        lessonDurationMinutes: trainer.lessonDurationMinutes ?? 60,
        availableTimes: (trainer.availableTimes ?? []).map((time) => ({
            dayOfWeek: time.dayOfWeek ?? '',
            startTime: time.startTime ?? '',
            endTime: time.endTime ?? '',
        })),
    }
}

function PageMessage({
    icon,
    title,
    showAction = false,
}: {
    icon: string
    title: string
    showAction?: boolean
}) {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-center">
            <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
            <h2 className="mt-md font-headline-sm text-headline-sm text-on-surface">{title}</h2>
            {showAction && (
                <Link
                    href="/matching"
                    className="mt-md inline-flex h-11 items-center justify-center rounded-lg border border-primary px-md font-label-bold text-primary hover:bg-primary-fixed"
                >
                    매칭 페이지로 돌아가기
                </Link>
            )}
        </div>
    )
}
