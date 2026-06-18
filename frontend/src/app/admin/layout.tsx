'use client'

import { useAuth } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const NAV_ITEMS = [
    { label: '문의 관리', icon: 'support_agent', href: '/admin/inquiries' },
    { label: '회원 관리', icon: 'group', href: '/admin/members' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, initialized } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!initialized) return
        if (!user) { router.push('/auth/login'); return }
        if (user.role !== 'ADMIN') { router.push('/'); return }
    }, [initialized, user])

    if (!initialized) return null

    return (
        <div className="flex bg-surface-container-low min-h-screen">
            {/* 사이드바 */}
            <aside className="fixed left-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 flex flex-col border-r border-surface-container-high bg-surface-container-low py-6 px-4 z-40">
                <div className="mb-8 px-2">
                    <h1 className="text-headline-sm font-bold text-primary">FitMate Admin</h1>
                    <p className="text-body-sm text-on-surface-variant opacity-70">운영자 포털</p>
                </div>
                <nav className="flex-grow space-y-2">
                    {NAV_ITEMS.map(item => {
                        const active = pathname.startsWith(item.href)
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                                    active
                                        ? 'bg-primary text-on-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container-high'
                                }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
                <div className="border-t border-surface-container-high pt-4">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        사이트로 돌아가기
                    </button>
                </div>
            </aside>

            {/* 메인 영역 */}
            <div className="ml-64 flex flex-col flex-1 pt-16 md:pt-20">
                {/* 페이지 콘텐츠 */}
                <main className="flex-grow p-8 max-w-[1280px] w-full mx-auto">
                    {children}
                </main>

                {/* 푸터 */}
                <footer className="flex shrink-0 items-center justify-between border-t border-surface-container-high bg-surface-container-low px-8 py-4">
                    <span className="text-sm text-on-surface-variant">© 2024 FitMate Professional Admin System</span>
                    <div className="flex gap-6 text-sm text-on-surface-variant">
                        <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
                        <a href="#" className="hover:text-primary transition-colors">이용약관</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}
