'use client'

import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/apiClient';
import { Suspense, useState } from 'react';



import { useRouter, useSearchParams } from 'next/navigation';


























































function LoginContent() {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') ?? '/'
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const loginWith = async (id: string, pw: string) => {
        setUserId(id)
        setPassword(pw)
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, password: pw }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                setError(body?.code === '401-3' ? '탈퇴된 계정입니다.' : '아이디 또는 비밀번호가 올바르지 않습니다.')
                return
            }
            const data = await res.json()
            const token = data.accessToken
            let profileImage: string | null = null
            try {
                const meRes = await fetch(`${API_BASE_URL}/api/members/me`, { headers: { Authorization: `Bearer ${token}` } })
                if (meRes.ok) profileImage = (await meRes.json()).profileImage ?? null
            } catch {}
            login({ memberId: data.memberId, userName: data.userName, nickname: data.nickname, role: data.role, token, profileImage })
            router.push(redirectTo)
        } catch {
            setError('서버에 연결할 수 없습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password }),
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                const code = body?.code ?? ''
                if (code === '401-3') {
                    setError('탈퇴된 계정입니다. 로그인할 수 없습니다.')
                } else {
                    setError('아이디 또는 비밀번호가 올바르지 않습니다.')
                }
                return
            }

            const data = await res.json()
            const token = data.accessToken

            let profileImage: string | null = null
            try {
                const meRes = await fetch(`${API_BASE_URL}/api/members/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (meRes.ok) {
                    const me = await meRes.json()
                    profileImage = me.profileImage ?? null
                }
            } catch {}

            login({
                memberId: data.memberId,
                userName: data.userName,
                nickname: data.nickname,
                role: data.role,
                token,
                profileImage,
            })
            router.push(redirectTo)
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
            <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-md px-10 py-12">

                <a href="/" className="font-display-lg font-extrabold text-[32px] leading-10 tracking-tight text-center text-primary mb-1 block hover:opacity-80 transition-opacity">
                    FitMate
                </a>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-body-sm font-medium text-on-surface-variant">
                            아이디
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                            className="w-full border border-outline-variant rounded-xl px-4 py-3 text-body-sm outline-none focus:border-primary transition-colors bg-surface-container-lowest text-on-surface placeholder:text-outline"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-body-sm font-medium text-on-surface-variant">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                            className="w-full border border-outline-variant rounded-xl px-4 py-3 text-body-sm outline-none focus:border-primary transition-colors bg-surface-container-lowest text-on-surface placeholder:text-outline"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-error text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-primary text-on-primary rounded-xl py-3.5 text-[15px] font-semibold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <a
                        href="/auth/signup"
                        className="flex items-center justify-center w-full bg-surface-container-lowest text-primary border border-primary rounded-xl py-3.5 text-[15px] font-semibold hover:bg-primary-fixed transition-colors"
                    >
                        회원가입
                    </a>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-outline-variant" />
                    <span className="text-xs text-outline">또는</span>
                    <div className="flex-1 h-px bg-outline-variant" />
                </div>

                <div className="flex flex-col gap-2.5">
                    <a
                        href={`${API_BASE_URL}/oauth2/authorization/kakao`}
                        className="flex items-center justify-center w-full bg-[#FEE500] text-[#191919] rounded-xl py-3.5 text-[15px] font-semibold hover:brightness-95 transition-all"
                    >
                        카카오로 로그인
                    </a>

                    <a
                        href={`${API_BASE_URL}/oauth2/authorization/google`}
                        className="flex items-center justify-center w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-xl py-3.5 text-[15px] font-semibold hover:bg-surface-container-low transition-colors"
                    >
                        구글로 로그인
                    </a>
                </div>

                <div className="mt-6 pt-5 border-t border-outline-variant">
                    <p className="text-xs text-outline text-center mb-2">테스트 계정으로 빠른 로그인</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => loginWith('user01', '1234')}
                            className="flex-1 py-2 text-xs font-medium border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                            일반 회원
                        </button>
                        <button
                            type="button"
                            onClick={() => loginWith('trainer01', '1234')}
                            className="flex-1 py-2 text-xs font-medium border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                            트레이너
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    )
}
