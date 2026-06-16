'use client'

import MyReviewList from '@/components/MyReviewList';
import { useState } from 'react';









// 사이드바 메뉴 정의
const MENUS = [
    { key: 'matching', label: '매칭 관리', icon: 'handshake' },
    { key: 'review', label: '리뷰 관리', icon: 'rate_review' },
    { key: 'account', label: '계정 설정', icon: 'settings' },
] as const

type MenuKey = (typeof MENUS)[number]['key']

export default function MyPage() {
    const [activeMenu, setActiveMenu] = useState<MenuKey>('review')

    return (
        <main className="min-h-screen bg-background pt-16 md:pt-20">
            <div className="mx-auto max-w-screen-xl px-margin-mobile py-md md:px-margin-desktop">
                {/* 프로필 헤더 */}
                <section className="mb-md flex items-center justify-between rounded-xl bg-surface-container-low p-md shadow-sm">
                    <div className="flex items-center gap-md">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim" />
                        <div>
                            <h2 className="text-headline-md font-headline-md text-on-surface">
                                홍길동
                            </h2>
                            <p className="text-body-md text-on-surface-variant">
                                근력 트레이닝 매니아
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-md py-3 text-body-md text-on-surface">
                        ⚙️ 프로필 설정
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
                                    className={`flex items-center gap-md rounded-lg px-md py-3 text-body-md transition-colors ${
                                        activeMenu === menu.key
                                            ? 'bg-primary-container text-on-primary-container'
                                            : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">{menu.icon}</span>
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