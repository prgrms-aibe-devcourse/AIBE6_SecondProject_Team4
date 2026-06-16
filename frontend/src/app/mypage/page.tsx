'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type TrainerProfile = components['schemas']['TrainerProfileResponse']
type UserProfile = components['schemas']['UserProfileResponse']

export default function MyPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchMyProfile()
    }, [user, searchParams])

    const fetchMyProfile = async () => {
        const client = getAuthClient()
        setLoading(true)
        try {
            if (user?.role === 'TRAINER') {
                const { data, response } = await client.GET('/api/trainers/me')
                if (response.ok && data) {
                    setTrainerProfile(data)
                } else {
                    setTrainerProfile(null)
                }
            } else {
                const { data, response } = await client.GET('/api/users/me')
                if (response.ok && data) {
                    setUserProfile(data)
                } else {
                    setUserProfile(null)
                }
            }
        } catch {
            setTrainerProfile(null)
            setUserProfile(null)
        }
        setLoading(false)
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
            <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <h1 className="font-headline-md text-headline-md mb-xl">마이페이지</h1>

                {user?.role === 'TRAINER' ? (
                    trainerProfile ? (
                        // 트레이너 프로필 있을 때
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                                    {trainerProfile?.profileImage ? (
                                        <img
                                            src={trainerProfile.profileImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-outline">
                                            person
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-headline-sm text-headline-sm">
                                        {trainerProfile?.nickname}
                                    </h2>
                                    <p className="text-secondary">
                                        {trainerProfile?.introduction ?? '소개가 없습니다.'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-surface-container rounded-xl p-4">
                                    <p className="font-label-md text-secondary text-sm mb-1">
                                        종목
                                    </p>
                                    <p className="font-label-bold">
                                        {trainerProfile?.sports ?? '-'}
                                    </p>
                                </div>
                                <div className="bg-surface-container rounded-xl p-4">
                                    <p className="font-label-md text-secondary text-sm mb-1">
                                        레슨 방식
                                    </p>
                                    <p className="font-label-bold">
                                        {trainerProfile?.lessonType === 'ONE_TO_ONE'
                                            ? '1:1'
                                            : '그룹'}
                                    </p>
                                </div>
                                <div className="bg-surface-container rounded-xl p-4">
                                    <p className="font-label-md text-secondary text-sm mb-1">
                                        가격
                                    </p>
                                    <p className="font-label-bold">
                                        {trainerProfile?.price?.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="bg-surface-container rounded-xl p-4">
                                    <p className="font-label-md text-secondary text-sm mb-1">
                                        경력
                                    </p>
                                    <p className="font-label-bold">
                                        {trainerProfile?.careerYears}년
                                    </p>
                                </div>
                            </div>
                            <button
                                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all"
                                onClick={() => router.push('/mypage/edit')}
                            >
                                프로필 수정
                            </button>
                        </div>
                    ) : (
                        // 트레이너 프로필 없을 때
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
                                person_add
                            </span>
                            <p className="text-secondary mb-6">아직 트레이너 프로필이 없습니다.</p>
                            <button
                                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all"
                                onClick={() => router.push('/mypage/edit')}
                            >
                                프로필 등록하기
                            </button>
                        </div>
                    )
                ) : userProfile ? (
                    // 유저 프로필 있을 때
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
                                {userProfile?.profileImage ? (
                                    <img
                                        src={userProfile.profileImage}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-outline">
                                        person
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="font-headline-sm text-headline-sm">
                                    {userProfile?.nickname}
                                </h2>
                                <p className="text-secondary">
                                    {userProfile?.introduction ?? '소개가 없습니다.'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">
                                    관심 종목
                                </p>
                                <p className="font-label-bold">{userProfile?.sports ?? '-'}</p>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">레벨</p>
                                <p className="font-label-bold">{userProfile?.level ?? '-'}</p>
                            </div>
                            <div className="bg-surface-container rounded-xl p-4">
                                <p className="font-label-md text-secondary text-sm mb-1">목표</p>
                                <p className="font-label-bold">{userProfile?.goal ?? '-'}</p>
                            </div>
                        </div>
                        <button
                            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all"
                            onClick={() => router.push('/mypage/edit')}
                        >
                            프로필 수정
                        </button>
                    </div>
                ) : (
                    // 유저 프로필 없을 때
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
                            person_add
                        </span>
                        <p className="text-secondary mb-6">아직 프로필이 없습니다.</p>
                        <button
                            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all"
                            onClick={() => router.push('/mypage/edit')}
                        >
                            프로필 등록하기
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
