'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

type TrainerProfile = components['schemas']['TrainerProfileResponse']
type UserProfile = components['schemas']['UserProfileResponse']

export default function ProfileEditPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // 트레이너 폼
    const [trainerForm, setTrainerForm] = useState({
        sports: '',
        lessonType: 'ONE_TO_ONE',
        price: '',
        careerYears: '',
    })
    const [trainerId, setTrainerId] = useState<number | null>(null)

    // 유저 폼
    const [userForm, setUserForm] = useState({
        sports: '',
        level: '',
        goal: '',
    })
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchMyProfile()
    }, [user])

    const fetchMyProfile = async () => {
        const client = getAuthClient()
        if (user?.role === 'TRAINER') {
            const { data } = await client.GET('/api/trainers/me')
            if (data) {
                setTrainerId(data.id ?? null)
                setTrainerForm({
                    sports: data.sports ?? '',
                    lessonType: data.lessonType ?? 'ONE_TO_ONE',
                    price: data.price?.toString() ?? '',
                    careerYears: data.careerYears?.toString() ?? '',
                })
            }
        } else {
            const { data } = await client.GET('/api/users/me')
            if (data) {
                setUserId(data.id ?? null)
                setUserForm({
                    sports: data.sports ?? '',
                    level: data.level ?? '',
                    goal: data.goal ?? '',
                })
            }
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        const client = getAuthClient()

        if (user?.role === 'TRAINER') {
            if (trainerId) {
                // 수정
                await client.PUT('/api/trainers/{id}', {
                    params: { path: { id: trainerId } },
                    body: {
                        sports: trainerForm.sports,
                        lessonType: trainerForm.lessonType,
                        price: Number(trainerForm.price),
                        careerYears: Number(trainerForm.careerYears),
                    },
                })
            } else {
                // 등록
                await client.POST('/api/trainers', {
                    body: {
                        sports: trainerForm.sports,
                        lessonType: trainerForm.lessonType,
                        price: Number(trainerForm.price),
                        careerYears: Number(trainerForm.careerYears),
                    },
                })
            }
        } else {
            if (userId) {
                // 수정
                await client.PUT('/api/users/{id}', {
                    params: { path: { id: userId } },
                    body: {
                        sports: userForm.sports,
                        level: userForm.level,
                        goal: userForm.goal,
                    },
                })
            } else {
                // 등록
                await client.POST('/api/users', {
                    body: {
                        sports: userForm.sports,
                        level: userForm.level,
                        goal: userForm.goal,
                    },
                })
            }
        }

        setSaving(false)
        router.push('/mypage?t=' + Date.now())
    }

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                </span>
            </main>
        )
    }

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="flex items-center gap-3 mb-xl">
                    <button
                        className="flex items-center gap-1 text-secondary hover:text-on-surface transition"
                        onClick={() => router.back()}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-headline-md text-headline-md">
                        {(user?.role === 'TRAINER' ? trainerId : userId)
                            ? '프로필 수정'
                            : '프로필 등록'}
                    </h1>
                </div>

                <div className="space-y-6">
                    {user?.role === 'TRAINER' ? (
                        // 트레이너 폼
                        <>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    종목
                                </label>
                                <input
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="예: 헬스, 요가, 필라테스"
                                    value={trainerForm.sports}
                                    onChange={(e) =>
                                        setTrainerForm((f) => ({ ...f, sports: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    레슨 방식
                                </label>
                                <div className="flex gap-2">
                                    {[
                                        { label: '1:1', value: 'ONE_TO_ONE' },
                                        { label: '그룹', value: 'GROUP' },
                                    ].map(({ label, value }) => (
                                        <button
                                            key={value}
                                            className={`px-6 py-3 rounded-xl font-label-bold border transition-all ${
                                                trainerForm.lessonType === value
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-surface-container border-outline-variant text-secondary hover:border-primary'
                                            }`}
                                            onClick={() =>
                                                setTrainerForm((f) => ({ ...f, lessonType: value }))
                                            }
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    가격 (원/회)
                                </label>
                                <input
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="예: 50000"
                                    type="number"
                                    value={trainerForm.price}
                                    onChange={(e) =>
                                        setTrainerForm((f) => ({ ...f, price: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    경력 (년)
                                </label>
                                <input
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="예: 3"
                                    type="number"
                                    value={trainerForm.careerYears}
                                    onChange={(e) =>
                                        setTrainerForm((f) => ({
                                            ...f,
                                            careerYears: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        // 유저 폼
                        <>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    관심 종목
                                </label>
                                <input
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="예: 헬스, 요가"
                                    value={userForm.sports}
                                    onChange={(e) =>
                                        setUserForm((f) => ({ ...f, sports: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    레벨
                                </label>
                                <div className="flex gap-2">
                                    {[
                                        { label: '초급', value: 'BEGINNER' },
                                        { label: '중급', value: 'INTERMEDIATE' },
                                        { label: '고급', value: 'ADVANCED' },
                                    ].map(({ label, value }) => (
                                        <button
                                            key={value}
                                            className={`px-6 py-3 rounded-xl font-label-bold border transition-all ${
                                                userForm.level === value
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-surface-container border-outline-variant text-secondary hover:border-primary'
                                            }`}
                                            onClick={() =>
                                                setUserForm((f) => ({ ...f, level: value }))
                                            }
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary text-sm">
                                    목표
                                </label>
                                <input
                                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="예: 다이어트, 근력 향상"
                                    value={userForm.goal}
                                    onChange={(e) =>
                                        setUserForm((f) => ({ ...f, goal: e.target.value }))
                                    }
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            className="flex-1 border border-outline-variant text-secondary py-3 rounded-xl font-label-bold hover:bg-surface-container transition"
                            onClick={() => router.back()}
                        >
                            취소
                        </button>
                        <button
                            className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
