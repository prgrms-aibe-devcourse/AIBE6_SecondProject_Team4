'use client'

import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/utils/apiClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Role = 'USER' | 'TRAINER'

export default function SocialSignupPage() {
    const { user } = useAuth()
    const router = useRouter()

    const [role, setRole] = useState<Role>('USER')
    const [nickname, setNickname] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [agreed, setAgreed] = useState(false)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const inputStyle: React.CSSProperties = {
        width: '100%',
        border: '1px solid #c2c6d8',
        borderRadius: '12px',
        padding: '16px 24px',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const labelStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#0B1C30',
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

        if (!agreed) {
            setError('이용약관 및 개인정보처리방침에 동의해주세요.')
            return
        }

        setLoading(true)

        try {
            const authClient = getAuthClient()

            const { error: profileError } = await authClient.PATCH('/api/members/me', {
                body: {
                    nickname,
                    phone,
                    email,
                },
            })

            if (profileError) {
                setError('정보 저장에 실패했습니다. 입력 내용을 확인해주세요.')
                return
            }

            const { error: roleError } = await authClient.PATCH('/api/members/me/role', {
                body: { role },
            })

            if (roleError) {
                setError('가입 유형 저장에 실패했습니다.')
                return
            }

            router.push('/')
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
                justifyContent: 'center',
                alignItems: 'center',
                padding: '128px 20px 64px',
            }}
        >
            <div
                style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '32px 32px 48px',
                    gap: '48px',
                    width: '100%',
                    maxWidth: '480px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(211, 228, 254, 0.2)',
                    boxShadow: '0px 4px 12px rgba(0, 87, 205, 0.04)',
                    borderRadius: '16px',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h1
                        style={{
                            width: '100%',
                            fontWeight: 700,
                            fontSize: '32px',
                            lineHeight: '40px',
                            letterSpacing: '-0.32px',
                            textAlign: 'center',
                            color: '#0B1C30',
                            margin: 0,
                        }}
                    >
                        추가 정보 입력
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
                        {user?.userName ? `${user.userName}님, ` : ''}서비스 이용을 위해 몇 가지 정보가 더 필요해요
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                >
                    {/* User Type Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <label style={labelStyle}>가입 유형</label>
                        <div
                            style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                width: '100%',
                                background: '#E5EEFF',
                                border: '1px solid #C2C6D6',
                                borderRadius: '12px',
                                padding: '5px',
                                gap: '6px',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setRole('USER')}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: role === 'USER' ? '#0057CD' : 'transparent',
                                    color: role === 'USER' ? '#FFFFFF' : '#424654',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: role === 'USER' ? '0px 4px 12px rgba(0, 87, 205, 0.15)' : 'none',
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
                                    padding: '16px',
                                    background: role === 'TRAINER' ? '#0057CD' : 'transparent',
                                    color: role === 'TRAINER' ? '#FFFFFF' : '#424654',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: role === 'TRAINER' ? '0px 4px 12px rgba(0, 87, 205, 0.15)' : 'none',
                                    transition: 'background 0.2s, color 0.2s',
                                }}
                            >
                                트레이너
                            </button>
                        </div>
                    </div>

                    {/* Nickname */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <label style={labelStyle}>닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="사용하실 닉네임을 입력해 주세요"
                            required
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
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

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
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

                    {/* Terms */}
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
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
                        <p style={{ fontSize: '13px', color: '#ba1a1a', textAlign: 'center', margin: 0 }}>
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
                            fontSize: '18px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading ? '저장 중...' : '시작하기'}
                    </button>
                </form>
            </div>
        </main>
    )
}
