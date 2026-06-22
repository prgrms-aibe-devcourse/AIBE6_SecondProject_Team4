'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OAuth2RedirectPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [error, setError] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const accessToken = params.get('accessToken')

        if (!accessToken) {
            setError('로그인 정보를 받지 못했습니다.')
            setTimeout(() => router.push('/auth/login'), 1500)
            return
        }

        fetchMyInfoAndLogin(accessToken)
    }, [])

    async function fetchMyInfoAndLogin(accessToken: string) {
        try {
            const res = await fetch('http://localhost:8080/api/members/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            if (!res.ok) {
                setError('회원 정보를 불러오지 못했습니다.')
                setTimeout(() => router.push('/auth/login'), 1500)
                return
            }

            const member = await res.json()

            login({
                memberId: member.id,
                userName: member.userName,
                nickname: member.nickname,
                role: member.role,
                token: accessToken,
                profileImage: member.profileImage ?? null,
            })

            const isNewSocialUser = member.phone === '000-0000-0000' || !member.email

            if (isNewSocialUser) {
                router.push('/auth/social-signup')
            } else {
                router.push('/')
            }
        } catch {
            setError('서버 연결에 실패했습니다.')
            setTimeout(() => router.push('/auth/login'), 1500)
        }
    }

    return (
        <main
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '12px',
            }}
        >
            <p style={{ fontSize: '15px', color: '#424655' }}>
                {error || '로그인 처리 중입니다...'}
            </p>
        </main>
    )
}
