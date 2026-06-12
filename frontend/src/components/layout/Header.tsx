'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const AVATAR_FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23bfc3d4'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M4 20c0-4 3.6-7 8-7s8 3 8 7'/%3E%3C/svg%3E"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-sm border-b border-outline-variant h-16 md:h-20 transition-shadow ${
                scrolled ? 'shadow-md' : ''
            }`}
        >
            <div className="max-w-screen-xl mx-auto h-full flex justify-between items-center px-margin-mobile md:px-margin-desktop">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-headline-md text-headline-md text-primary">FitMate</span>
                </Link>

                <nav className="hidden md:flex items-center gap-gutter">
                    {[
                        { label: '트레이너 찾기', href: '/trainer' },
                        { label: 'AI매칭', href: '/matching' },
                        { label: '마이페이지', href: '/mypage' },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="relative font-label-bold text-secondary hover:text-primary transition-colors py-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
                                notifications
                            </button>
                            <div className="hidden md:flex items-center gap-3 group relative">
                                <span className="font-label-bold text-on-surface">{user.userName} 님</span>
                                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary overflow-hidden border border-outline-variant cursor-pointer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={AVATAR_FALLBACK}
                                        alt={user.userName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* 호버 드롭다운 */}
                                <div className="absolute right-0 top-full pt-2 w-36 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                                <div className="bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden">
                                    <Link
                                        href="/mypage"
                                        className="block px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                                    >
                                        마이페이지
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-body-sm text-error hover:bg-surface-container transition-colors"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full font-label-bold text-label-bold hover:shadow-md active:scale-95 transition-all"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
