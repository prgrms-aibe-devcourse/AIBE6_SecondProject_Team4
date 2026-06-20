'use client'

import { getAuthClient } from '@/utils/apiClient';
import { useEffect, useRef, useState } from 'react';



import { useRouter, useSearchParams } from 'next/navigation';










export default function PaymentSuccess() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const paymentKey = searchParams.get('paymentKey')
        const orderId = searchParams.get('orderId')
        const amount = searchParams.get('amount')

        if (!paymentKey || !orderId || !amount) {
            setStatus('error')
            setMessage('결제 정보가 올바르지 않습니다.')
            return
        }

        const confirm = async () => {
            const client = getAuthClient()
            const { error } = await client.POST('/api/payments/confirm', {
                body: {
                    paymentKey,
                    orderId,
                    amount: Number(amount),
                },
            } as never)

            if (error) {
                setStatus('error')
                setMessage('결제 승인에 실패했습니다.')
            } else {
                setStatus('success')
                setMessage('결제가 완료되었습니다!')
            }
        }
        confirm()
    }, [searchParams])

    return (
        <main
            style={{
                width: '100%',
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 16px 40px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid var(--color-outline-variant, #e0e0e0)',
                    background: '#ffffff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {status === 'loading' && (
                    <>
                        <span
                            className="material-symbols-outlined animate-spin"
                            style={{ fontSize: '48px', color: '#0057CD', marginBottom: '16px' }}
                        >
                            progress_activity
                        </span>
                        <p style={{ fontSize: '16px', color: '#0B1C30' }}>
                            결제를 확인하고 있습니다...
                        </p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: '56px',
                                color: '#0057CD',
                                marginBottom: '16px',
                                fontVariationSettings: "'FILL' 1",
                            }}
                        >
                            check_circle
                        </span>
                        <h1
                            style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#0B1C30',
                                marginBottom: '8px',
                            }}
                        >
                            {message}
                        </h1>
                        <p style={{ fontSize: '14px', color: '#424654', marginBottom: '24px' }}>
                            이제 레슨 후기를 작성하실 수 있습니다.
                        </p>
                        <button
                            onClick={() => router.push('/mypage?tab=matching')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#0057CD',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            매칭 관리로 이동
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: '56px',
                                color: '#ba1a1a',
                                marginBottom: '16px',
                                fontVariationSettings: "'FILL' 1",
                            }}
                        >
                            error
                        </span>
                        <h1
                            style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#0B1C30',
                                marginBottom: '8px',
                            }}
                        >
                            결제 실패
                        </h1>
                        <p style={{ fontSize: '14px', color: '#424654', marginBottom: '24px' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => router.push('/mypage?tab=matching')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#fff',
                                color: '#0B1C30',
                                border: '1px solid #c2c6d8',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            돌아가기
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}
