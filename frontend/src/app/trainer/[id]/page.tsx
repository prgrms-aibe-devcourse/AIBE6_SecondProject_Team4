'use client'

import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']

interface Props {
    params: Promise<{ id: string }>
}

export default function TrainerDetailPage({ params }: Props) {
    const router = useRouter()
    const [trainer, setTrainer] = useState<Trainer | null>(null)
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState<string>('')

    useEffect(() => {
        params.then(({ id }) => {
            setId(id)
        })
    }, [params])

    useEffect(() => {
        if (!id) return
        const fetchTrainer = async () => {
            const client = getAuthClient()
            const { data } = await client.GET('/api/trainers/{id}', {
                params: { path: { id: Number(id) } },
            })
            setTrainer(data ?? null)
            setLoading(false)
        }
        fetchTrainer()
    }, [id])

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                </span>
            </main>
        )
    }

    if (!trainer) {
        return (
            <main className="pt-16 md:pt-20">
                <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
                    <p className="text-secondary">트레이너를 찾을 수 없습니다.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                {/* 뒤로가기 */}
                <button
                    className="flex items-center gap-1 text-secondary mb-6 hover:text-on-surface transition"
                    onClick={() => router.back()}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    목록으로
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                    {/* 왼쪽 - 프로필 이미지 */}
                    <div className="md:col-span-1">
                        <div className="w-full aspect-square bg-surface-container rounded-2xl flex items-center justify-center overflow-hidden">
                            {trainer.profileImage ? (
                                <img
                                    src={trainer.profileImage}
                                    alt={trainer.nickname ?? ''}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-8xl text-outline">
                                    person
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽 - 프로필 정보 */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h1 className="font-headline-md text-headline-md">
                                {trainer.nickname}
                            </h1>
                            <p className="text-secondary mt-2">
                                {trainer.introduction ?? '소개가 없습니다.'}
                            </p>
                        </div>

                        {/* 기본 정보 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">종목</p>
                                <p className="font-label-bold">{trainer.sports ?? '-'}</p>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">
                                    레슨 방식
                                </p>
                                <p className="font-label-bold">
                                    {trainer.lessonType === 'ONE_TO_ONE' ? '1:1' : '그룹'}
                                </p>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">지역</p>
                                <p className="font-label-bold">{trainer.region ?? '-'}</p>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">경력</p>
                                <p className="font-label-bold">{trainer.careerYears ?? '-'}년</p>
                            </div>
                        </div>

                        {/* 가격 + 매칭 버튼 */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-secondary text-sm mb-1">레슨 가격</p>
                                <p className="font-headline-sm text-primary text-2xl font-bold">
                                    ₩{trainer.price?.toLocaleString()}
                                    <span className="text-secondary text-sm font-normal ml-1">
                                        / 회
                                    </span>
                                </p>
                            </div>
                            <button className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all">
                                매칭 신청하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
