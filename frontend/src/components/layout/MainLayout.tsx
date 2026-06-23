'use client'

import ChatFAB from '@/components/ChatFAB'

import { usePathname } from 'next/navigation'

import Footer from './Footer'
import Header from './Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const isAuth = pathname.startsWith('/auth')

    if (isAdmin)
        return (
            <>
                <Header />
                <div className="flex-1">{children}</div>
            </>
        )
    if (isAuth) return <div className="flex-1">{children}</div>

    return (
        <>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <ChatFAB />
        </>
    )
}
