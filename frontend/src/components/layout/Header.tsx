'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
                    <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
                        notifications
                    </button>
                    <Link
                        href="/auth/login"
                        className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full font-label-bold text-label-bold hover:shadow-md active:scale-95 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </header>
    )
}
