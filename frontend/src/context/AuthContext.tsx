'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface AuthUser {
    memberId: number
    userName: string
    role: string
    token: string
}

interface AuthContextType {
    user: AuthUser | null
    login: (user: AuthUser) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem('fitmate_user')
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem('fitmate_user')
            }
        }
    }, [])

    const login = (user: AuthUser) => {
        setUser(user)
        localStorage.setItem('fitmate_user', JSON.stringify(user))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('fitmate_user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
