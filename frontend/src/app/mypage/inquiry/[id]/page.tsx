'use client'

import { getAuthClient } from '@/utils/apiClient'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { components } from '@/types/api'

type InquiryResponse = components['schemas']['InquiryResponse']

const TYPE_LABEL: Record<string, string> = {
    MATCHING: '매칭',
    TRAINER: '트레이너',
    ETC: '기타',
}

const formatDate = (str?: string) => {
    if (!str) return '-'
    const d = new Date(str)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function InquiryDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)

    const [inquiry, setInquiry] = useState<InquiryResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            const client = getAuthClient()
            const { data } = await client.GET('/api/inquiries/{inquiryId}', {
                params: { path: { inquiryId: id } },
            })
            setInquiry(data ?? null)
            setLoading(false)
        }
        fetch()
    }, [id])

    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto px-4 md:px-margin-desktop pt-24 md:pt-28 pb-10 space-y-4">
                <div className="h-8 w-40 rounded-lg bg-surface-container animate-pulse" />
                <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-8 space-y-5">
                    <div className="h-5 w-24 rounded-full bg-surface-container animate-pulse" />
                    <div className="h-7 w-2/3 rounded bg-surface-container animate-pulse" />
                    <div className="h-4 w-32 rounded bg-surface-container animate-pulse" />
                    <div className="space-y-2 pt-4">
                        <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-surface-container animate-pulse" />
                        <div className="h-4 w-4/6 rounded bg-surface-container animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4">inbox</span>
                <p>문의를 찾을 수 없습니다.</p>
                <button onClick={() => router.push('/mypage?tab=inquiries')} className="mt-4 text-primary hover:underline cursor-pointer">
                    목록으로 돌아가기
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-margin-desktop pt-24 md:pt-28 pb-10">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                    </button>
                    <h1 className="text-headline-md font-bold text-on-surface">문의 상세 내역</h1>
                </div>
                <button
                    onClick={() => router.push('/mypage?tab=inquiries')}
                    className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
                >
                    목록으로 돌아가기
                </button>
            </div>

            {/* 상세 카드 */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-container-high flex flex-col gap-8">
                {/* 문의 헤더 */}
                <div className="flex flex-col gap-2 pb-6 border-b border-surface-container-high">
                    <div className="flex items-center gap-2">
                        {inquiry.status === 'RESOLVED' ? (
                            <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold">답변 완료</span>
                        ) : (
                            <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full text-xs font-bold">답변 대기</span>
                        )}
                        <span className="text-secondary font-bold text-sm">카테고리: {TYPE_LABEL[inquiry.type ?? ''] ?? inquiry.type}</span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface mt-1">{inquiry.title}</h2>
                    <div className="flex items-center text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
                        작성일: {formatDate(inquiry.createdAt)}
                    </div>
                </div>

                {/* 문의 본문 */}
                <div className="p-6 bg-surface-container-low rounded-xl">
                    <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{inquiry.content}</p>
                </div>

                {/* 관리자 답변 */}
                {inquiry.status === 'RESOLVED' && inquiry.answer && (
                    <div className="relative mt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-on-surface">FitMate 고객센터 매니저</span>
                            </div>
                        </div>
                        <div className="p-6 bg-primary-fixed text-on-primary-fixed rounded-xl relative">
                            <div className="absolute -top-2 left-5 w-4 h-4 bg-primary-fixed rotate-45" />
                            <p className="text-body-md leading-relaxed relative z-10 whitespace-pre-wrap">{inquiry.answer}</p>
                        </div>
                    </div>
                )}

                {/* 답변 대기 안내 */}
                {inquiry.status === 'PENDING' && (
                    <div className="flex items-center gap-3 p-5 bg-surface-container rounded-xl text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary">schedule</span>
                        <p className="text-body-sm">담당자가 확인 중입니다. 빠른 시일 내에 답변 드리겠습니다.</p>
                    </div>
                )}

                {/* 하단 버튼 */}
                <div className="flex justify-end gap-3 pt-6 border-t border-surface-container-high">
                    <button
                        onClick={() => router.push('/mypage?tab=inquiries')}
                        className="px-6 py-3 border border-outline-variant rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
                    >
                        목록으로
                    </button>
                    <button
                        onClick={() => router.push('/inquiry')}
                        className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                        추가 문의하기
                    </button>
                </div>
            </div>
        </div>
    )
}
