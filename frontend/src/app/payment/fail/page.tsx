'use client'
import { Suspense } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

function PaymentFailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get('message') ?? '결제가 취소되었거나 실패했습니다.'
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
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '56px',
                        color: '#ba1a1a',
                        marginBottom: '16px',
                        fontVariationSettings: "'FILL' 1",
                    }}
                >
                    cancel
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
                        background: '#0057CD',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    돌아가기
                </button>
            </div>
        </main>
    )
}

export default function PaymentFail() {
    return (
        <Suspense fallback={null}>
            <PaymentFailContent />
        </Suspense>
    )
}
