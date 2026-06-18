'use client'

import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/utils/apiClient'

/**
 * 작성 가능한 후기 (매칭 성사 후 미작성 트레이너)
 *
 * GET  /api/reviews/writable  → 성사(ACCEPTED)된 레슨 중 후기 미작성 트레이너 목록
 * POST /api/reviews           → 후기 작성 (matchingId, trainerId 전달)
 */

// 작성 가능한 후기 대상 (WritableReviewResponse 와 일치)
interface WritableTarget {
    lessonRequestId: number
    matchingId: number   // 후기 작성 시 필요
    trainerId: number    // 후기 작성 시 필요
    trainerNickname: string
    sports: string
    lessonDate: string   // 수업 날짜 (YYYY-MM-DD)
}

// 날짜 포맷 (2026-06-15 → 2026.06.15)
function formatDate(iso: string) {
    return iso?.slice(0, 10).replace(/-/g, '.') ?? ''
}

// 별점 입력 (머티리얼 아이콘, 클릭으로 선택)
function StarInput({
                       rating,
                       onChange,
                   }: {
    rating: number
    onChange: (r: number) => void
}) {
    return (
        <div className="flex text-primary">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(i)}
                    className="material-symbols-outlined cursor-pointer text-[24px] transition-colors"
                    style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                    star
                </button>
            ))}
        </div>
    )
}

// 트레이너 카드 한 장 (작성 폼이 카드 안에서 펼쳐짐)
function WritableCard({
                          target,
                          onSubmit,
                      }: {
    target: WritableTarget
    onSubmit: (target: WritableTarget, rating: number, content: string) => void
}) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(5)
    const [content, setContent] = useState('')

    const handleSubmit = () => {
        if (content.trim().length < 10) {
            alert('후기는 최소 10자 이상 입력해주세요.')
            return
        }
        onSubmit(target, rating, content)
    }

    return (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            {/* 카드 상단: 트레이너 정보 + 작성하기 버튼 */}
            <div className="flex items-center justify-between p-md">
                <div className="flex items-center gap-md">
                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary-fixed to-primary-fixed-dim shadow-sm" />
                    <div className="flex flex-col gap-xs">
                        <h3 className="text-headline-sm font-headline-sm text-on-surface">
                            {target.trainerNickname}
                        </h3>
                        <div className="flex items-center gap-sm">
                            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-md font-label-bold text-on-secondary-container">
                                {target.sports}
                            </span>
                            <span className="text-body-sm text-on-surface-variant">
                                {formatDate(target.lessonDate)} 수업
                            </span>
                        </div>
                    </div>
                </div>
                {open ? (
                    <button
                        disabled
                        className="cursor-default rounded-lg bg-surface-container-high px-md py-2 text-label-bold font-label-bold text-on-surface-variant"
                    >
                        작성 중
                    </button>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg bg-primary px-md py-2 text-label-bold font-label-bold text-on-primary shadow-sm transition-all hover:scale-[0.98]"
                    >
                        작성하기
                    </button>
                )}
            </div>

            {/* 인라인 작성 폼 (펼쳐짐) */}
            {open && (
                <div className="border-t border-outline-variant bg-surface-container-low p-md">
                    <div className="mx-auto flex max-w-2xl flex-col gap-md">
                        {/* 별점 */}
                        <div className="flex items-center gap-md">
                            <span className="text-label-bold font-label-bold text-on-surface">
                                별점 선택
                            </span>
                            <StarInput rating={rating} onChange={setRating} />
                        </div>

                        {/* 내용 */}
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value.slice(0, 500))}
                                rows={4}
                                placeholder="트레이너님과의 운동 경험을 공유해주세요. (최소 10자 이상)"
                                className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-body-md placeholder:text-outline-variant focus:border-primary focus:outline-none"
                            />
                            <span className="absolute bottom-2 right-3 text-label-md text-on-surface-variant">
                                {content.length} / 500
                            </span>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end gap-sm">
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    setContent('')
                                    setRating(5)
                                }}
                                className="rounded-lg border-2 border-outline-variant px-md py-2 text-label-bold font-label-bold text-on-surface-variant transition-all hover:bg-surface-variant/20"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="rounded-lg bg-primary px-xl py-2 text-label-bold font-label-bold text-on-primary shadow-sm transition-all hover:scale-[0.98]"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function WritableReviewList() {
    const { user } = useAuth()
    const [targets, setTargets] = useState<WritableTarget[]>([])
    const [loading, setLoading] = useState(false)

    // 작성 가능한 후기 목록 불러오기
    const fetchWritable = useCallback(async () => {
        if (!user) return
        setLoading(true)
        try {
            const { data, error } = await apiClient.GET('/api/reviews/writable', {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            if (error) throw new Error('목록을 불러오지 못했습니다.')
            setTargets((data as WritableTarget[]) ?? [])
        } catch {
            setTargets([])
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchWritable()
    }, [fetchWritable])

    // 후기 등록 핸들러
    const handleSubmit = async (
        target: WritableTarget,
        rating: number,
        content: string,
    ) => {
        if (!user) return

        const { error } = await apiClient.POST('/api/reviews', {
            headers: { Authorization: `Bearer ${user.token}` },
            body: {
                matchingId: target.matchingId,
                trainerId: target.trainerId,
                rating,
                content,
            },
        })
        if (error) {
            alert('후기 작성에 실패했습니다.')
            return
        }

        // 등록 성공 → 목록에서 제거 (후기 작성됨 = 더 이상 작성 가능 아님)
        setTargets((prev) => prev.filter((t) => t.lessonRequestId !== target.lessonRequestId))
        alert('후기가 등록되었습니다.')
    }

    if (loading) {
        return <p className="py-xl text-center text-outline">불러오는 중...</p>
    }

    // 빈 상태
    if (targets.length === 0) {
        return (
            <div className="mt-lg flex flex-col items-center gap-md rounded-xl border-2 border-dashed border-outline-variant p-xl opacity-40">
                <span className="material-symbols-outlined text-[48px]">history_edu</span>
                <p className="text-body-md font-label-bold">
                    작성 가능한 후기가 없습니다.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-md">
            {targets.map((target) => (
                <WritableCard
                    key={target.lessonRequestId}
                    target={target}
                    onSubmit={handleSubmit}
                />
            ))}
        </div>
    )
}