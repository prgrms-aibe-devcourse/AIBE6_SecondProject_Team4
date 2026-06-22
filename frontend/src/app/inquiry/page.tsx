'use client'

import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/utils/apiClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type InquiryType = 'MATCHING' | 'TRAINER' | 'ETC'

const TYPE_OPTIONS: { value: InquiryType; label: string }[] = [
    { value: 'MATCHING', label: '매칭 관련' },
    { value: 'TRAINER', label: '트레이너 문의' },
    { value: 'ETC', label: '기타' },
]

export default function InquiryPage() {
    const router = useRouter()
    const { user } = useAuth()

    const [type, setType] = useState<InquiryType | ''>('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) router.push('/auth/login?redirect=/inquiry')
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!type) {
            setError('문의 유형을 선택해 주세요.')
            return
        }
        setError('')
        setSubmitting(true)
        try {
            const client = getAuthClient()
            const { response } = await client.POST('/api/inquiries', {
                body: { type, title, content },
            })
            if (response.ok) {
                router.push('/inquiry/complete')
            } else {
                setError('문의 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.')
            }
        } catch {
            setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="flex-1 bg-background">
            <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-16 md:py-20 min-h-screen">
                {/* 헤더 */}
                <div className="mb-8 mt-4">
                    <h1 className="font-bold text-2xl md:text-[24px] text-on-surface mb-2">1:1 문의하기</h1>
                    <p className="text-on-surface-variant text-sm md:text-base">
                        문의하실 내용을 남겨주시면 확인 후 신속하게 답변해 드리겠습니다.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 폼 */}
                    <section className="flex-grow">
                        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* 문의 유형 */}
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-semibold text-on-surface mb-2"
                                    >
                                        문의 유형 <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value as InquiryType | '')}
                                            required
                                            className="w-full h-12 px-4 appearance-none bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm md:text-base text-on-surface"
                                        >
                                            <option value="" disabled>
                                                유형을 선택해 주세요
                                            </option>
                                            {TYPE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* 제목 */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-semibold text-on-surface mb-2"
                                    >
                                        제목 <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        maxLength={100}
                                        placeholder="제목을 입력해 주세요"
                                        className="w-full h-12 px-4 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm md:text-base text-on-surface placeholder:text-outline"
                                    />
                                </div>

                                {/* 문의 내용 */}
                                <div>
                                    <label
                                        htmlFor="content"
                                        className="block text-sm font-semibold text-on-surface mb-2"
                                    >
                                        문의 내용 <span className="text-error">*</span>
                                    </label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        rows={10}
                                        maxLength={2000}
                                        placeholder="자세한 문의 내용을 입력해 주시면 보다 정확한 답변이 가능합니다."
                                        className="w-full p-4 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm md:text-base text-on-surface placeholder:text-outline resize-none"
                                    />
                                    <p className="text-right text-xs text-outline mt-1">
                                        {content.length} / 2000
                                    </p>
                                </div>

                                {/* 에러 메시지 */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg text-error text-sm">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {error}
                                    </div>
                                )}

                                {/* 버튼 */}
                                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full md:w-auto md:min-w-[160px] h-12 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-[#0047b3] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                제출 중...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-base">send</span>
                                                문의 제출하기
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="w-full md:w-auto md:min-w-[100px] h-12 bg-surface-container-highest text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-dim transition-all active:scale-95"
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* 사이드바 */}
                    <aside className="w-full lg:w-[300px] flex flex-col gap-4">
                        {/* 안내 사항 */}
                        <div className="bg-surface-container-high rounded-xl p-6">
                            <h3 className="font-semibold text-lg text-on-surface mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                안내 사항
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">
                                        check_circle
                                    </span>
                                    <p className="text-sm text-on-surface-variant">
                                        문의하신 내용은 마이페이지 &gt; 내 문의 내역에서 확인하실 수 있습니다.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">
                                        schedule
                                    </span>
                                    <p className="text-sm text-on-surface-variant">
                                        평균 답변 소요 시간은 영업일 기준 24시간 이내입니다.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">
                                        verified_user
                                    </span>
                                    <p className="text-sm text-on-surface-variant">
                                        개인정보가 포함된 내용은 관리자만 확인할 수 있도록 안전하게 처리됩니다.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* FAQ 바로가기 */}
                        <div className="bg-primary text-white rounded-xl p-6 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="font-semibold text-lg mb-2">자주 묻는 질문</h3>
                                <p className="text-sm mb-4 opacity-90">
                                    문의 전 FAQ를 확인하시면 더욱 빠르게 궁금증을 해결하실 수 있습니다.
                                </p>
                                <Link
                                    href="/faq"
                                    className="inline-flex items-center gap-1 text-sm font-semibold hover:underline transition-all"
                                >
                                    FAQ 바로가기
                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </Link>
                            </div>
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform select-none">
                                help
                            </span>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
