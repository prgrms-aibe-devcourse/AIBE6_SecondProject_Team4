'use client'

import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/utils/apiClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data, error: apiError } = await apiClient.POST('/api/auth/login', {
                body: { userId, password },
            })

            if (apiError || !data) {
                setError('아이디 또는 비밀번호가 올바르지 않습니다.')
                return
            }

            const token = data.accessToken!
            let profileImage: string | null = null
            try {
                const meRes = await fetch('http://localhost:8080/api/members/me', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (meRes.ok) {
                    const me = await meRes.json()
                    profileImage = me.profileImage ?? null
                }
            } catch {}

            login({
                memberId: data.memberId!,
                userName: data.userName!,
                nickname: data.nickname!,
                role: data.role!,
                token,
                profileImage,
            })
            router.push('/')
        } catch {
            setError('서버 연결에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px 16px 64px' }}>
            <div style={{ width: '100%', maxWidth: '440px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '48px 40px' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '32px', lineHeight: '40px', letterSpacing: '-0.32px', textAlign: 'center', color: '#00419D', margin: '0 0 4px' }}>
                    FitMate
                </p>

                <h1 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', color: '#181c24' }}>
                    로그인
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 500, color: '#424655' }}>아이디</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                            style={{ width: '100%', border: '1px solid #c2c6d8', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => (e.target.style.borderColor = '#0057cd')}
                            onBlur={(e) => (e.target.style.borderColor = '#c2c6d8')}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 500, color: '#424655' }}>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                            style={{ width: '100%', border: '1px solid #c2c6d8', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => (e.target.style.borderColor = '#0057cd')}
                            onBlur={(e) => (e.target.style.borderColor = '#c2c6d8')}
                        />
                    </div>

                    {error && (
                        <p style={{ fontSize: '13px', color: '#ba1a1a', textAlign: 'center' }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '8px', width: '100%', background: loading ? '#93b4e8' : '#0057cd', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <a
                        href="/auth/signup"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '100%', background: 'white', color: '#0057cd',
                            border: '1px solid #0057cd', borderRadius: '12px', padding: '14px',
                            fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        회원가입
                    </a>
                </form>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e5ee' }} />
                    <span style={{ fontSize: '13px', color: '#9097a8' }}>또는</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e5ee' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a
                        href="http://localhost:8080/oauth2/authorization/kakao"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '100%', background: '#FEE500', color: '#191919',
                            border: 'none', borderRadius: '12px', padding: '14px',
                            fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        카카오로 로그인
                    </a>

                    <a
                        href="http://localhost:8080/oauth2/authorization/google"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '100%', background: 'white', color: '#191919',
                            border: '1px solid #c2c6d8', borderRadius: '12px', padding: '14px',
                            fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        구글로 로그인
                    </a>
                </div>


            </div>
        </main>
    )
}
