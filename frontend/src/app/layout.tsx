import ChatFAB from '@/components/ChatFAB'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { AuthProvider } from '@/context/AuthContext'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
    title: 'FitMate',
    description: '나만의 인생 트레이너를 만나보세요',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko" className="h-full">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-full flex flex-col bg-background text-on-surface overflow-x-hidden">
                <AuthProvider>
                    <Header />
                    {children}
                    <Footer />
                    <ChatFAB />
                </AuthProvider>
            </body>
        </html>
    )
}
