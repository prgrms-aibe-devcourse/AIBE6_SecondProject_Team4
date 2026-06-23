'use client'

import { API_BASE_URL, setTokenRefreshHandler } from '@/utils/apiClient';
import { createContext, useContext, useEffect, useState } from 'react';























export interface AuthUser {
    memberId: number
    userName: string
    nickname: string
    role: string
    token: string
    profileImage?: string | null
}

interface AuthContextType {
    user: AuthUser | null
    initialized: boolean
    login: (user: AuthUser) => void
    logout: () => Promise<void>
    updateProfileImage: (url: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('fitmate_user')
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem('fitmate_user')
            }
        }
        setInitialized(true)
    }, [])

    const login = (user: AuthUser) => {
        setUser(user)
        localStorage.setItem('fitmate_user', JSON.stringify(user))
    }

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
        } catch {
            // 네트워크 오류여도 로컬 로그아웃 진행
        }
        setUser(null)
        localStorage.removeItem('fitmate_user')
    }

    useEffect(() => {
        // 토큰 재발급 시 새 토큰을 상태에 반영
        setTokenRefreshHandler((newToken: string) => {
            setUser(prev => {
                if (!prev) return prev
                const updated = { ...prev, token: newToken }
                localStorage.setItem('fitmate_user', JSON.stringify(updated))
                return updated
            })
        })

        // 재발급 실패 시 로그아웃
        const handleAuthLogout = () => logout()
        window.addEventListener('auth:logout', handleAuthLogout)
        return () => window.removeEventListener('auth:logout', handleAuthLogout)
    }, [])

    const updateProfileImage = (url: string | null) => {
        setUser(prev => {
            if (!prev) return prev
            const updated = { ...prev, profileImage: url }
            localStorage.setItem('fitmate_user', JSON.stringify(updated))
            return updated
        })
    }

    return (
        <AuthContext.Provider value={{ user, initialized, login, logout, updateProfileImage }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
