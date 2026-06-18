'use client'

import { apiClient } from '@/utils/apiClient'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

type Role = 'USER' | 'TRAINER'

export default function SignupPage() {
    const router = useRouter()

    const [role, setRole] = useState<Role>('USER')
    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [agreed, setAgreed] = useState(false)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const inputStyle: React.CSSProperties = {
        width: '100%',
        border: '1px solid #c2c6d8',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const labelStyle: React.CSSProperties = {
        fontSize: '12px',
        fontWeight: 500,
        color: '#424655',
    }

    const fieldGroupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#0057cd'
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = '#c2c6d8'
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }

        if (!agreed) {
            setError('이용약관 및 개인정보처리방침에 동의해주세요.')
            return
        }

        setLoading(true)

        try {
            const { error: apiError } = await apiClient.POST('/api/auth/signup', {
                body: {
                    userId,
                    userName,
                    password,
                    nickname,
                    email,
                    phone,
                    role,
                },
            })

            if (apiError) {
                setError('회원가입에 실패했습니다. 입력 내용을 확인해주세요.')
                return
            }

            router.push('/auth/login')
        } catch {
            setError('서버 연결에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '120px 20px 48px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '64px',
                    gap: '32px',
                    width: '100%',
                    maxWidth: '672px',
                    background: '#FFFFFF',
                    boxShadow: '0px 4px 12px rgba(0, 65, 157, 0.04)',
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                }}
            >
                {/* Header Section */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '16px',
                        width: '100%',
                    }}
                >
                    <h1
                        style={{
                            width: '100%',
                            fontWeight: 700,
                            fontSize: '40px',
                            lineHeight: '48px',
                            textAlign: 'center',
                            letterSpacing: '-0.8px',
                            color: '#0B1C30',
                            margin: 0,
                        }}
                    >
                        피트니스 여정을 시작하세요
                    </h1>

                    <p
                        style={{
                            width: '100%',
                            fontSize: '16px',
                            lineHeight: '24px',
                            textAlign: 'center',
                            color: '#424654',
                            margin: 0,
                        }}
                    >
                        나에게 맞는 트레이너를 찾는 가장 빠른 방법
                    </p>
                </div>

                {/* Role Toggle */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '4px',
                        gap: '4px',
                        width: '100%',
                        background: '#E5EEFF',
                        borderRadius: '9999px',
                        boxSizing: 'border-box',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setRole('USER')}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            background: role === 'USER' ? '#0057CD' : 'transparent',
                            color: role === 'USER' ? '#FFFFFF' : '#424654',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.14px',
                            cursor: 'pointer',
                            boxShadow: role === 'USER' ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                    >
                        일반 회원
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('TRAINER')}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            background: role === 'TRAINER' ? '#0057CD' : 'transparent',
                            color: role === 'TRAINER' ? '#FFFFFF' : '#424654',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.14px',
                            cursor: 'pointer',
                            boxShadow: role === 'TRAINER' ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                    >
                        트레이너
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        width: '100%',
                    }}
                >
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>아이디</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="사용할 아이디를 입력해 주세요"
                            required
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>성함</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="홍길동"
                                required
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>닉네임</label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임을 입력해 주세요"
                                required
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>전화번호</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            required
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>이메일 주소</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@example.com"
                            required
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div style={fieldGroupStyle}>
                            <label style={labelStyle}>비밀번호 확인</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#424654',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '2px',
                                accentColor: '#0057CD',
                                flexShrink: 0,
                            }}
                        />
                        <span>FitMate의 이용약관 및 개인정보처리방침에 동의합니다.</span>
                    </label>

                    {error && (
                        <p
                            style={{
                                fontSize: '13px',
                                color: '#ba1a1a',
                                textAlign: 'center',
                                margin: 0,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px 0',
                            background: loading ? '#93b4e8' : '#0057CD',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow:
                                '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading ? '가입 중...' : 'FitMate 가입하기'}
                    </button>

                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#424654',
                            margin: 0,
                        }}
                    >
                        이미 계정이 있으신가요?{' '}
                        <a
                            href="/auth/login"
                            style={{ color: '#0057CD', fontWeight: 600, textDecoration: 'none' }}
                        >
                            로그인
                        </a>
                    </p>
                </form>
            </div>
        </main>
    )
}
