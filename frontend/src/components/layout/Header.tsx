'use client'

import { useAuth } from '@/context/AuthContext'
import { type AlertItem, useAlert } from '@/hooks/useAlert'
import { getImageUrl } from '@/utils/apiClient'
import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

function getAlertHref(alert: AlertItem): string {
    if (!alert.targetId) return '#'
    switch (alert.type) {
        case 'MATCHING':
            return `/matching/${alert.targetId}`
        case 'REVIEW':
            return `/trainer/${alert.targetId}`
        default:
            return '#'
    }
}

function formatRelativeTime(dateStr?: string): string {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return '방금 전'
    if (min < 60) return `${min}분 전`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}시간 전`
    return `${Math.floor(hr / 24)}일 전`
}

const NAV_LINKS = [
    { label: '트레이너 찾기', href: '/trainer' },
    { label: 'AI매칭', href: '/matching' },
    { label: '마이페이지', href: '/mypage' },
]

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const alertRef = useRef<HTMLDivElement>(null)
    const { user, logout } = useAuth()
    const router = useRouter()
    const { alerts, unreadCount, markOneRead, markAllRead, deleteOne, deleteAll } = useAlert()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
                setAlertOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
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
                    {NAV_LINKS.map(({ label, href }) => (
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
                            {/* 알림 버튼 + 드롭다운 */}
                            <div className="relative flex items-center" ref={alertRef}>
                                <button
                                    className="material-symbols-outlined text-secondary md:hover:text-primary transition-colors flex items-center cursor-pointer leading-none w-9 h-9 rounded-full justify-center md:hover:bg-primary-fixed"
                                    onClick={() => setAlertOpen((prev) => !prev)}
                                >
                                    notifications
                                    {unreadCount > 0 && (
                                        <span
                                            className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-[3px] bg-error text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {alertOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-surface-container-lowest shadow-2xl rounded-2xl border border-outline-variant overflow-hidden z-50">
                                        {/* 헤더 */}
                                        <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                                            <h4 className="font-label-bold text-on-surface">
                                                알림
                                            </h4>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    일괄 읽음
                                                </button>
                                                <button
                                                    onClick={deleteAll}
                                                    className="text-xs text-secondary hover:underline"
                                                >
                                                    일괄 삭제
                                                </button>
                                            </div>
                                        </div>

                                        {/* 알림 목록 */}
                                        <div className="max-h-96 overflow-y-auto">
                                            {alerts.length === 0 ? (
                                                <p className="text-center text-secondary text-body-sm py-8">
                                                    알림이 없습니다.
                                                </p>
                                            ) : (
                                                alerts.map((alert) => (
                                                    <div
                                                        key={alert.id}
                                                        className="px-4 py-3 border-b border-outline-variant hover:bg-surface-container transition-colors relative group"
                                                    >
                                                        {alert.type === 'MESSAGE' ? (
                                                            <button
                                                                className="flex gap-3 w-full text-left cursor-pointer"
                                                                onClick={() => {
                                                                    setAlertOpen(false)
                                                                    if (!alert.isRead && alert.id)
                                                                        markOneRead(alert.id)
                                                                    window.dispatchEvent(
                                                                        new CustomEvent(
                                                                            'open-chat-room',
                                                                            {
                                                                                detail: {
                                                                                    roomId: alert.targetId,
                                                                                },
                                                                            }
                                                                        )
                                                                    )
                                                                }}
                                                            >
                                                                <div
                                                                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${alert.isRead ? '' : 'bg-primary'}`}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p
                                                                        className={`text-body-sm ${alert.isRead ? 'text-on-surface-variant' : 'text-on-surface'}`}
                                                                    >
                                                                        {alert.content}
                                                                    </p>
                                                                    <p className="text-xs text-secondary mt-0.5">
                                                                        {formatRelativeTime(
                                                                            alert.createdAt
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                href={getAlertHref(alert)}
                                                                onClick={() => {
                                                                    setAlertOpen(false)
                                                                    if (!alert.isRead && alert.id)
                                                                        markOneRead(alert.id)
                                                                }}
                                                                className="flex gap-3"
                                                            >
                                                                <div
                                                                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${alert.isRead ? '' : 'bg-primary'}`}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p
                                                                        className={`text-body-sm ${alert.isRead ? 'text-on-surface-variant' : 'text-on-surface'}`}
                                                                    >
                                                                        {alert.content}
                                                                    </p>
                                                                    <p className="text-xs text-secondary mt-0.5">
                                                                        {formatRelativeTime(
                                                                            alert.createdAt
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                alert.id && deleteOne(alert.id)
                                                            }}
                                                            className="absolute right-3 top-3 material-symbols-outlined text-sm text-secondary opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                                                        >
                                                            close
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:flex items-center gap-3 group relative">
                                <Link
                                    href="/mypage"
                                    className="font-label-bold text-on-surface hover:text-primary transition-colors"
                                >
                                    {user.userName} 님
                                </Link>
                                <Link
                                    href="/mypage"
                                    className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary overflow-hidden border border-outline-variant cursor-pointer"
                                >
                                    {user.profileImage ? (
                                        <img
                                            src={getImageUrl(user.profileImage)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-2xl">
                                            person
                                        </span>
                                    )}
                                </Link>
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

                    {/* 햄버거 버튼 — 모바일 전용 */}
                    <div className="md:hidden flex items-center">
                        <button
                            className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer leading-none"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        >
                            {menuOpen ? 'close' : 'menu'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 드로어 */}
            {menuOpen && (
                <div className="md:hidden bg-surface border-t border-outline-variant shadow-lg">
                    <nav className="flex flex-col">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className="px-margin-mobile py-4 font-label-bold text-secondary hover:text-primary hover:bg-surface-container transition-colors border-b border-outline-variant/40"
                            >
                                {label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link
                                    href="/mypage"
                                    onClick={() => setMenuOpen(false)}
                                    className="px-margin-mobile py-4 flex items-center gap-3 border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary border border-outline-variant overflow-hidden">
                                        {user.profileImage ? (
                                            <img
                                                src={getImageUrl(user.profileImage)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-lg">
                                                person
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-label-bold text-on-surface">
                                        {user.userName} 님
                                    </span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleLogout()
                                    }}
                                    className="px-margin-mobile py-4 text-left font-label-bold text-error hover:bg-surface-container transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMenuOpen(false)}
                                className="px-margin-mobile py-4 font-label-bold text-primary hover:bg-surface-container transition-colors"
                            >
                                로그인
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
