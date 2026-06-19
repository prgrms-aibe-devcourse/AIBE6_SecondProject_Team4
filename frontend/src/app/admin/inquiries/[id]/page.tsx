'use client'

import { getAuthClient } from '@/utils/apiClient'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { components } from '@/types/api'

type InquiryResponse = components['schemas']['InquiryResponse']

const TYPE_LABEL: Record<string, string> = {
    MATCHING: '매칭 문의',
    TRAINER: '트레이너 문의',
    ETC: '기타 문의',
}

const TEMPLATES: Record<string, string> = {
    '[매칭] 지역 매칭 안내':
        '안녕하세요, 회원님. FitMate 고객 지원팀입니다.\n\n매칭 서비스 이용에 불편을 드려 죄송합니다. 현재 AI 매칭은 활동 지역, 전문 분야, 일정 등 다양한 요소를 종합적으로 반영하고 있습니다. 선호 지역을 보다 세밀하게 설정하시려면 프로필 > 희망 지역 설정에서 변경하실 수 있습니다.\n\n추가 문의사항이 있으시면 언제든 말씀해 주세요.\n\n감사합니다.',
    '[트레이너] 트레이너 변경 안내':
        '안녕하세요, 회원님. FitMate 고객 지원팀입니다.\n\n트레이너 변경을 원하시는 경우, 마이페이지 > 매칭 현황에서 현재 매칭을 종료하신 후 다시 매칭을 신청하시면 새로운 트레이너를 추천받으실 수 있습니다.\n\n변경 과정에서 불편하신 점이 있으시면 언제든지 말씀해 주세요.\n\n감사합니다.',
    '[서비스] 이용 방법 안내':
        '안녕하세요, 회원님. FitMate 고객 지원팀입니다.\n\nFitMate 서비스는 회원 가입 후 프로필에 운동 목표와 선호 조건을 입력하시면 AI가 최적의 트레이너를 추천해 드립니다. 추천된 트레이너의 프로필을 확인하신 후 매칭을 신청하시면 트레이너와 1:1로 연결됩니다.\n\n추가로 궁금하신 점이 있으시면 언제든지 문의해 주세요.\n\n감사합니다.',
    '[계정] 비밀번호 분실 처리':
        '안녕하세요, 회원님.\n\n비밀번호 재설정은 로그인 화면 하단의 "비밀번호 찾기"를 통해 이메일로 재설정 링크를 받으실 수 있습니다.\n\n추가 문의가 있으시면 언제든지 연락 주세요.\n\n감사합니다.',
    '[일반] 정중한 거절 안내':
        '안녕하세요, 회원님.\n\n문의 주신 내용을 검토하였으나, 현재 정책상 요청하신 사항을 처리해드리기 어려운 점 양해 부탁드립니다.\n\n더 궁금하신 점이 있으시면 언제든지 말씀해 주세요.\n\n감사합니다.',
}

const formatDate = (str?: string) => {
    if (!str) return '-'
    const d = new Date(str)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function AdminInquiryDetailPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const id = Number(params.id)
    const fromPage = searchParams.get('page') ?? '0'
    const backUrl = `/admin/inquiries?page=${fromPage}`

    const [inquiry, setInquiry] = useState<InquiryResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [answer, setAnswer] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchInquiry()
    }, [id])

    const fetchInquiry = async () => {
        setLoading(true)
        const client = getAuthClient()
        // 목록에서 해당 건만 가져오기 (개별 조회 API 없으므로 목록에서 필터)
        const { data } = await client.GET('/api/admin/inquiries', {
            params: { query: { page: 0, size: 9999 } as any },
        })
        if (data?.content) {
            const found = (data.content as InquiryResponse[]).find(i => i.id === id)
            setInquiry(found ?? null)
            if (found?.answer) setAnswer(found.answer)
        }
        setLoading(false)
    }

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        setSelectedTemplate(val)
        if (val && TEMPLATES[val]) setAnswer(TEMPLATES[val])
    }

    const handleSubmit = async () => {
        if (!inquiry?.id || !answer.trim()) return
        setSubmitting(true)
        const client = getAuthClient()
        const { response } = await client.POST('/api/admin/inquiries/{inquiryId}/answer', {
            params: { path: { inquiryId: inquiry.id } },
            body: { answer },
        })
        setSubmitting(false)
        if (response.ok) {
            setSuccess(true)
            setTimeout(() => {
                router.push(backUrl)
            }, 1200)
        }
    }

    if (loading) {
        return (
            <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '24px' }}>
                <div className="col-span-12 lg:col-span-7 space-y-4">
                    <div className="h-8 w-32 rounded-lg bg-surface-container animate-pulse" />
                    <div className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-8 space-y-4">
                        <div className="h-6 w-24 rounded-full bg-surface-container animate-pulse" />
                        <div className="h-7 w-3/4 rounded bg-surface-container animate-pulse" />
                        <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-surface-container animate-pulse" />
                        <div className="h-4 w-4/6 rounded bg-surface-container animate-pulse" />
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <div className="rounded-xl border border-primary bg-surface-container-lowest p-8 space-y-4">
                        <div className="h-6 w-24 rounded bg-surface-container animate-pulse" />
                        <div className="h-10 w-full rounded-lg bg-surface-container animate-pulse" />
                        <div className="h-80 w-full rounded-lg bg-surface-container animate-pulse" />
                        <div className="h-12 w-full rounded-lg bg-surface-container animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4">inbox</span>
                <p>문의를 찾을 수 없습니다.</p>
                <button onClick={() => router.push(backUrl)} className="mt-4 text-primary hover:underline">목록으로 돌아가기</button>
            </div>
        )
    }

    return (
        <div>
            {/* 브레드크럼 & 뒤로가기 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <button onClick={() => router.push(backUrl)} className="hover:text-primary transition-colors">문의 관리</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-on-surface font-bold">문의 상세</span>
                </div>
                <button
                    onClick={() => router.push(backUrl)}
                    className="flex items-center gap-1 text-primary font-bold hover:underline text-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    목록으로 돌아가기
                </button>
            </div>

            {/* 2컬럼 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '24px' }}>
                {/* 왼쪽: 문의 내용 */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high">
                        {/* 헤더 */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                                    {TYPE_LABEL[inquiry.type ?? ''] ?? inquiry.type}
                                </span>
                                <h2 className="text-xl font-bold text-on-surface mt-1">{inquiry.title}</h2>
                            </div>
                            <span className="text-body-sm text-on-surface-variant whitespace-nowrap ml-4 shrink-0">{formatDate(inquiry.createdAt)}</span>
                        </div>

                        {/* 작성자 */}
                        <div className="flex items-center gap-4 py-4 border-y border-surface-container mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <div>
                                <p className="font-bold text-on-surface text-sm">회원 ID: {inquiry.memberId}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {inquiry.status === 'RESOLVED' ? (
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">답변 완료</span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-error-container px-2 py-0.5 text-xs font-bold text-on-error-container">답변 대기</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 본문 */}
                        <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">{inquiry.content}</p>
                    </div>

                    {/* 기존 답변 (RESOLVED인 경우) */}
                    {inquiry.status === 'RESOLVED' && inquiry.answer && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                                <h3 className="font-bold text-primary">등록된 답변</h3>
                            </div>
                            <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{inquiry.answer}</p>
                        </div>
                    )}
                </div>

                {/* 오른쪽: 답변 작성 */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-surface-container-lowest rounded-xl p-8 border border-primary sticky top-24">
                        <h3 className="text-lg font-bold text-primary mb-6">
                            {inquiry.status === 'RESOLVED' ? '답변 수정' : '답변 작성'}
                        </h3>

                        {/* 자주 쓰는 답변 */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-on-surface-variant mb-1">자주 쓰는 답변 선택</label>
                            <div className="relative">
                                <select
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
                                    className="w-full appearance-none bg-surface-container-high border-none rounded-lg px-4 py-3 text-body-sm focus:ring-2 focus:ring-primary pr-10"
                                >
                                    <option value="">템플릿을 선택하세요</option>
                                    {Object.keys(TEMPLATES).map(k => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                            </div>
                        </div>

                        {/* 답변 내용 */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-on-surface-variant mb-1">답변 내용</label>
                            <textarea
                                className="w-full h-80 bg-surface border border-outline-variant rounded-lg p-4 text-body-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none leading-relaxed"
                                placeholder="사용자에게 전달할 답변을 입력하세요..."
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                            />
                        </div>

                        {/* 등록 버튼 */}
                        <button
                            onClick={handleSubmit}
                            disabled={!answer.trim() || submitting || success}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-bold py-4 rounded-lg hover:opacity-90 shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            {success ? (
                                <><span className="material-symbols-outlined text-[20px]">check_circle</span>등록 완료!</>
                            ) : submitting ? (
                                <><span className="material-symbols-outlined text-[20px] animate-spin">sync</span>처리 중...</>
                            ) : (
                                <><span className="material-symbols-outlined text-[20px]">send</span>답변 등록</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
