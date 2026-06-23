'use client'

import LessonRequestForm from '@/components/lesson/LessonRequestForm'
import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']

export default function LessonRequestDirectCreatePage() {
    const { trainerId } = useParams<{ trainerId: string }>()
    const router = useRouter()
    const { user, initialized } = useAuth()
    const [trainer, setTrainer] = useState<Trainer | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (initialized && !user) {
            router.replace(`/auth/login?redirect=/lesson-requests/new/trainer/${trainerId}`)
            return
        }
    }, [initialized, user, router, trainerId])

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
                    <SkeletonForm />
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
                            lessonDurationMinutes: trainer.lessonDurationMinutes ?? 60,
                            region: trainer.region,
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

function Bone({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-surface-container ${className}`} />
}

function SkeletonForm() {
    return (
        <div className="space-y-md">
            <div className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
                <Bone className="h-20 w-20 shrink-0 rounded-lg" />
                <div className="space-y-sm">
                    <Bone className="h-6 w-36" />
                    <div className="flex gap-xs">
                        <Bone className="h-5 w-16 rounded-md" />
                        <Bone className="h-5 w-20 rounded-md" />
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md md:p-lg space-y-md">
                <div className="space-y-xs">
                    <Bone className="h-6 w-24" />
                    <Bone className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                    <div className="rounded-lg border border-outline-variant p-sm space-y-sm">
                        <div className="flex items-center justify-between">
                            <Bone className="h-5 w-20" />
                            <div className="flex gap-xs">
                                <Bone className="h-8 w-8 rounded-full" />
                                <Bone className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <Bone key={i} className="aspect-square rounded-md" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-md">
                        <div className="space-y-xs">
                            <Bone className="h-4 w-20" />
                            <Bone className="h-14 w-full rounded-lg" />
                        </div>
                        <div className="space-y-xs">
                            <Bone className="h-4 w-16" />
                            <div className="grid grid-cols-2 gap-xs">
                                <Bone className="h-12 rounded-lg" />
                                <Bone className="h-12 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md space-y-sm">
                <Bone className="h-6 w-32" />
                <Bone className="h-4 w-48" />
                <Bone className="h-28 w-full rounded-lg" />
            </div>
            <Bone className="h-14 w-full rounded-lg" />
        </div>
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
