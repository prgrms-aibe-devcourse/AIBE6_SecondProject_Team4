'use client'

import { useState } from 'react'

import MyReviewList from '@/components/MyReviewList'
import { useAuth } from '@/context/AuthContext'

// 사이드바 메뉴 (머티리얼 심볼 아이콘)
const MENUS = [
    { key: 'matching', label: '매칭 관리', icon: 'handshake' },
    { key: 'review', label: '리뷰 관리', icon: 'rate_review' },
    { key: 'account', label: '계정 설정', icon: 'manage_accounts' },
] as const

type MenuKey = (typeof MENUS)[number]['key']

export default function MyPage() {
    const { user } = useAuth()
    const [activeMenu, setActiveMenu] = useState<MenuKey>('review')

    return (
        <main className="min-h-screen bg-background pt-16 md:pt-20">
            <div className="mx-auto max-w-screen-xl px-margin-mobile py-md md:px-margin-desktop">
                {/* 프로필 헤더 */}
                <section className="mb-md flex items-center justify-between rounded-xl bg-surface-container-low p-md shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-md">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-primary-fixed to-primary-fixed-dim shadow-sm" />
                            <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary p-1.5 text-on-primary shadow-lg transition-transform hover:scale-110">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                        </div>
                        <div>
                            <h1 className="text-headline-md font-headline-md text-on-surface">
                                {user?.userName ?? '사용자'}
                            </h1>
                            <p className="flex items-center gap-xs text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">
                  fitness_center
                </span>
                                근력 트레이닝 매니아
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-high px-md py-3 text-label-bold font-label-bold text-on-surface transition-all hover:bg-surface-container-highest">
                        <span className="material-symbols-outlined">settings</span>
                        프로필 설정
                    </button>
                </section>

                {/* 본문: 사이드바 + 컨텐츠 */}
                <div className="flex flex-col gap-lg md:flex-row">
                    {/* 좌측 사이드바 */}
                    <aside className="w-full flex-shrink-0 md:w-64">
                        <nav className="flex flex-col gap-3">
                            {MENUS.map((menu) => (
                                <button
                                    key={menu.key}
                                    onClick={() => setActiveMenu(menu.key)}
                                    className={`group flex items-center gap-md rounded-lg px-md py-3 text-label-bold font-label-bold transition-all ${
                                        activeMenu === menu.key
                                            ? 'bg-primary-container text-on-primary-container'
                                            : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                >
                  <span
                      className={`material-symbols-outlined ${
                          activeMenu === menu.key ? '' : 'group-hover:text-primary'
                      }`}
                  >
                    {menu.icon}
                  </span>
                                    {menu.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* 우측 컨텐츠 */}
                    <div className="flex-1">
                        {activeMenu === 'review' && <MyReviewList />}
                        {activeMenu === 'matching' && (
                            <div className="py-xl text-center text-on-surface-variant">
                                매칭 관리는 준비 중입니다.
                            </div>
                        )}
                        {activeMenu === 'account' && (
                            <div className="py-xl text-center text-on-surface-variant">
                                계정 설정은 준비 중입니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}