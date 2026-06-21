'use client'

import LessonRequestForm from '@/components/lesson/LessonRequestForm'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']

export default function LessonRequestDirectCreatePage() {
    const { trainerId } = useParams<{ trainerId: string }>()
    const [trainer, setTrainer] = useState<Trainer | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!trainerId) {
            setErrorMessage('잘못된 레슨 요청 경로입니다.')
            setIsLoading(false)
            return
        }

        const loadTrainer = async () => {
            try {
                const client = getAuthClient()
                const { data, error } = await client.GET('/api/trainers/{id}', {
                    params: {
                        path: {
                            id: Number(trainerId),
                        },
                    },
                })

                if (error || !data) {
                    setErrorMessage('트레이너 정보를 불러오지 못했습니다.')
                    return
                }

                setTrainer(data)
            } catch {
                setErrorMessage('서버에 연결할 수 없습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadTrainer()
    }, [trainerId])

    return (
        <main className="flex-1 bg-background pt-16 md:pt-20">
            <section className="mx-auto max-w-4xl px-margin-mobile py-xl md:px-margin-desktop">
                <div className="mb-md">
                    <p className="font-label-bold text-label-bold text-primary">LESSON REQUEST</p>
                    <h1 className="mt-xs font-headline-md text-headline-md text-on-surface">
                        레슨 요청 작성
                    </h1>
                    <p className="mt-xs text-body-md text-on-surface-variant">
                        트레이너의 가능 시간 중에서 원하는 일정을 선택해 주세요.
                    </p>
                </div>

                {isLoading ? (
                    <PageMessage
                        icon="progress_activity"
                        title="트레이너 정보를 불러오는 중입니다."
                    />
                ) : errorMessage ? (
                    <PageMessage icon="error" title={errorMessage} showAction />
                ) : trainer ? (
                    <LessonRequestForm
                        directTrainer={{
                            trainerProfileId: trainer.id!,
                            trainerName: trainer.nickname ?? '트레이너',
                            profileImage: trainer.profileImage,
                            sports: trainer.sports,
                            lessonType: trainer.lessonType,
                            lessonLevel: trainer.lessonLevel,
                            price: trainer.price,
                            availableTimes: (trainer.availableTimes ?? []).map((t) => ({
                                dayOfWeek: t.dayOfWeek ?? '',
                                startTime: t.startTime ?? '',
                                endTime: t.endTime ?? '',
                            })),
                        }}
                        summary={null}
                    />
                ) : null}
            </section>
        </main>
    )
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
                    href="/trainer"
                    className="mt-md inline-flex h-11 items-center justify-center rounded-lg border border-primary px-md font-label-bold text-primary hover:bg-primary-fixed"
                >
                    트레이너 목록으로 돌아가기
                </Link>
            )}
        </div>
    )
}
