'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

type TrainerProfile = components['schemas']['TrainerProfileResponse']
type UserProfile = components['schemas']['UserProfileResponse']

export default function MyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, logout } = useAuth()
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('matching')

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
                setTrainerProfile(response.ok && data ? data : null)
            } else {
                const { data, response } = await client.GET('/api/users/me')
                setUserProfile(response.ok && data ? data : null)
            }
        } catch {
            setTrainerProfile(null)
            setUserProfile(null)
        }
        setLoading(false)
    }

    const profile = user?.role === 'TRAINER' ? trainerProfile : userProfile

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
        <main className="flex-grow max-w-[1440px] mx-auto w-full px-margin-desktop pt-20 pb-lg flex flex-col gap-md">
            {/* 프로필 헤더 */}
            <div
                className="bg-surface-container-low rounded-xl p-md flex items-center justify-between"
                style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
            >
                <div className="flex items-center gap-md">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-surface-container border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                            {profile?.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-outline">
                                    person
                                </span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                    </div>
                    <div>
                        <h1 className="text-headline-md font-headline-md text-on-surface">
                            {user?.userName}
                        </h1>
                        <p className="text-body-md text-on-surface-variant flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">
                                fitness_center
                            </span>
                            {user?.role === 'TRAINER' ? '트레이너' : '일반 회원'}
                        </p>
                    </div>
                </div>
                <button
                    className="flex items-center gap-xs px-md py-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg font-label-bold transition-all border border-outline-variant"
                    onClick={() => router.push('/mypage/edit')}
                >
                    <span className="material-symbols-outlined">settings</span>
                    프로필 설정
                </button>
            </div>

            {/* 사이드바 + 콘텐츠 */}
            <div className="flex gap-md flex-col lg:flex-row flex-grow">
                {/* 사이드바 */}
                <aside className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-xs">
                        {[
                            { id: 'matching', icon: 'handshake', label: '매칭 관리' },
                            { id: 'reviews', icon: 'rate_review', label: '리뷰 관리' },
                            { id: 'account', icon: 'manage_accounts', label: '계정 설정' },
                        ].map(({ id, icon, label }) => (
                            <button
                                key={id}
                                className={`w-full flex items-center gap-md px-md py-sm rounded-lg font-label-bold transition-all ${
                                    activeTab === id
                                        ? 'bg-primary-container text-on-primary-container'
                                        : 'hover:bg-surface-container-low text-on-surface-variant'
                                }`}
                                onClick={() => setActiveTab(id)}
                            >
                                <span className="material-symbols-outlined">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 메인 콘텐츠 */}
                <div className="flex-grow space-y-md">
                    {activeTab === 'matching' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                매칭 관리
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                                <div
                                    className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant flex flex-col gap-sm"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-primary">
                                        <span className="material-symbols-outlined">
                                            outgoing_mail
                                        </span>
                                        <span className="text-label-bold">보낸 요청</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="text-body-sm text-secondary text-center py-4">
                                            보낸 요청이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 text-primary font-label-bold hover:underline">
                                        모든 요청 보기
                                    </button>
                                </div>
                                <div
                                    className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant flex flex-col gap-sm"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-tertiary">
                                        <span className="material-symbols-outlined">inbox</span>
                                        <span className="text-label-bold">받은 요청</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="text-body-sm text-secondary text-center py-4">
                                            받은 요청이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 text-primary font-label-bold hover:underline">
                                        수신함 관리
                                    </button>
                                </div>
                                <div
                                    className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant flex flex-col gap-sm"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-secondary">
                                        <span className="material-symbols-outlined">verified</span>
                                        <span className="text-label-bold">매칭 완료 내역</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="text-body-sm text-secondary text-center py-4">
                                            매칭 내역이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 text-primary font-label-bold hover:underline">
                                        히스토리 보기
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'reviews' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                리뷰 관리
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                <div
                                    className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center justify-between mb-md">
                                        <span className="text-label-bold text-on-surface-variant">
                                            내가 받은 리뷰
                                        </span>
                                    </div>
                                    <p className="text-body-sm text-secondary text-center py-4">
                                        받은 리뷰가 없습니다.
                                    </p>
                                    <button className="w-full mt-md py-sm border-2 border-outline-variant rounded-lg text-label-bold text-on-surface hover:bg-surface transition-colors">
                                        모든 받은 리뷰 보기
                                    </button>
                                </div>
                                <div
                                    className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center justify-between mb-md">
                                        <span className="text-label-bold text-on-surface-variant">
                                            내가 작성한 리뷰
                                        </span>
                                    </div>
                                    <p className="text-body-sm text-secondary text-center py-4">
                                        작성한 리뷰가 없습니다.
                                    </p>
                                    <button className="w-full mt-md py-sm border-2 border-outline-variant rounded-lg text-label-bold text-on-surface hover:bg-surface transition-colors">
                                        모든 작성한 리뷰 보기
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'account' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                계정 설정
                            </h2>
                            <div
                                className="rounded-xl overflow-hidden border border-outline-variant"
                                style={{
                                    backgroundColor: '#f1f3ff',
                                    boxShadow: 'inset 0 2px 4px rgba(116,119,129,0.08)',
                                }}
                            >
                                <button className="w-full flex items-center justify-between p-md hover:bg-white/50 transition-colors border-b border-outline-variant">
                                    <div className="flex items-center gap-md">
                                        <span className="material-symbols-outlined text-on-surface-variant">
                                            lock
                                        </span>
                                        <div className="text-left">
                                            <p className="text-label-bold text-on-surface">
                                                비밀번호 및 보안
                                            </p>
                                            <p className="text-body-sm text-on-surface-variant">
                                                비밀번호 변경 및 2단계 인증 설정
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-outline">
                                        chevron_right
                                    </span>
                                </button>
                                <button
                                    className="w-full flex items-center justify-between p-md hover:bg-error-container/20 group transition-colors"
                                    onClick={() => {
                                        logout()
                                        router.push('/auth/login')
                                    }}
                                >
                                    <div className="flex items-center gap-md text-error">
                                        <span className="material-symbols-outlined">logout</span>
                                        <div className="text-left">
                                            <p className="text-label-bold">로그아웃</p>
                                            <p className="text-body-sm opacity-80">
                                                계정에서 안전하게 로그아웃합니다
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    )
}
