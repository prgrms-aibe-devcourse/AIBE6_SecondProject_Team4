'use client'

import { useAuth } from '@/context/AuthContext'
import { Review, useMyReviews } from '@/hooks/useMyReviews'
import { useState } from 'react'

// 별점 표시 — 머티리얼 아이콘 star (채움/빈)
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex text-tertiary">
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                    star
                </span>
            ))}
        </div>
    )
}

// 날짜 포맷 (2026-06-16T... → 2026.06.16)
function formatDate(iso: string) {
    return iso.slice(0, 10).replace(/-/g, '.')
}

// 후기 카드 한 장
function ReviewCard({
    review,
    isTrainer,
    onEdit,
    onDelete,
}: {
    review: Review
    isTrainer: boolean
    onEdit: (r: Review) => void
    onDelete: (id: number) => void
}) {
    return (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            {/* 상단: 프로필 + 별점 + (수정/삭제) */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-body-md font-bold text-on-surface">
                                {isTrainer
                                    ? review.reviewerNickname
                                    : `트레이너 #${review.trainerId}`}
                            </span>
                            {/* 사용자 화면에서 내가 쓴 후기 표시 뱃지 */}
                            {!isTrainer && (
                                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                                    나의 리뷰
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-label-md text-outline">
                                {formatDate(review.createdAt)}
                            </span>
                            {review.edited && (
                                <span className="text-label-md text-outline">(수정됨)</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 수정/삭제는 내가 쓴 후기(사용자)만 */}
                {!isTrainer && (
                    <div className="flex items-center gap-4 text-label-md">
                        <button
                            onClick={() => onEdit(review)}
                            className="text-on-surface-variant hover:text-primary"
                        >
                            수정
                        </button>
                        <span className="text-outline-variant">|</span>
                        <button
                            onClick={() => onDelete(review.id)}
                            className="text-error hover:opacity-80"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 후기 내용 */}
            <p className="text-body-md leading-relaxed text-on-surface-variant">{review.content}</p>
        </div>
    )
}

// 수정 모달
function EditModal({
    review,
    onSave,
    onClose,
}: {
    review: Review
    onSave: (rating: number, content: string) => void
    onClose: () => void
}) {
    const [rating, setRating] = useState(review.rating)
    const [content, setContent] = useState(review.content)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                className="w-full rounded-xl bg-surface-container-lowest p-6"
                style={{ maxWidth: '420px' }}
            >
                <h3 className="mb-md text-headline-sm font-headline-sm text-on-surface">
                    후기 수정
                </h3>

                {/* 별점 선택 (머티리얼 아이콘) */}
                <div className="mb-md flex gap-1 text-tertiary">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i)}
                            className="material-symbols-outlined text-[28px]"
                            style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                            star
                        </button>
                    ))}
                </div>

                {/* 내용 입력 */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-outline-variant p-3 text-body-md focus:border-primary focus:outline-none"
                    placeholder="후기 내용을 입력하세요"
                />

                {/* 버튼 */}
                <div className="mt-md flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-outline-variant px-5 py-2 text-body-md text-on-surface-variant"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(rating, content)}
                        disabled={!content.trim()}
                        className="rounded-lg bg-primary px-5 py-2 text-body-md text-on-primary disabled:opacity-50"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    )
}

type Tab = 'all' | 'writable'

/**
 * 리뷰 관리 (마이페이지)
 * - 사용자: 내가 쓴 후기 (수정/삭제 가능)
 * - 트레이너: 내가 받은 후기 (조회만)
 */
export default function MyReviewList() {
    const { user } = useAuth()
    const isTrainer = user?.role === 'TRAINER'

    const { reviews, loading, error, updateReview, deleteReview } = useMyReviews()
    const [tab, setTab] = useState<Tab>('all')
    const [sort, setSort] = useState<'latest' | 'rating'>('latest')
    const [editing, setEditing] = useState<Review | null>(null)

    const sorted = [...reviews].sort((a, b) =>
        sort === 'latest' ? b.createdAt.localeCompare(a.createdAt) : b.rating - a.rating
    )

    const handleDelete = async (id: number) => {
        if (confirm('이 후기를 삭제할까요?')) {
            await deleteReview(id)
        }
    }

    const handleSave = async (rating: number, content: string) => {
        if (editing) {
            await updateReview(editing.id, rating, content)
            setEditing(null)
        }
    }

    return (
        <div className="flex flex-col gap-md">
            {/* 헤더: 탭 + 정렬 */}
            <div className="flex items-end justify-between border-b border-outline-variant">
                <div className="flex gap-md">
                    <button
                        onClick={() => setTab('all')}
                        className={`px-2 pb-2.5 text-headline-sm font-headline-sm ${
                            tab === 'all'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-on-surface-variant'
                        }`}
                    >
                        {isTrainer ? '받은 후기' : '전체 후기'}
                    </button>
                    {!isTrainer && (
                        <button
                            onClick={() => setTab('writable')}
                            className={`px-2 pb-2.5 text-headline-sm font-headline-sm ${
                                tab === 'writable'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-on-surface-variant'
                            }`}
                        >
                            작성 가능한 후기
                        </button>
                    )}
                </div>
                {tab === 'all' && (
                    <div className="mb-2 flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-label-md">
                        <button
                            onClick={() => setSort('latest')}
                            className={
                                sort === 'latest'
                                    ? 'text-primary font-semibold'
                                    : 'text-on-surface-variant'
                            }
                        >
                            최신순
                        </button>
                        <span className="text-outline-variant">|</span>
                        <button
                            onClick={() => setSort('rating')}
                            className={
                                sort === 'rating'
                                    ? 'text-primary font-semibold'
                                    : 'text-on-surface-variant'
                            }
                        >
                            별점 높은순
                        </button>
                    </div>
                )}
            </div>

            {/* 전체/받은 후기 탭 */}
            {tab === 'all' &&
                (loading ? (
                    <p className="py-xl text-center text-outline">불러오는 중...</p>
                ) : error ? (
                    <p className="py-xl text-center text-error">{error}</p>
                ) : sorted.length === 0 ? (
                    <p className="py-xl text-center text-outline">
                        {isTrainer ? '받은 후기가 없습니다.' : '작성한 후기가 없습니다.'}
                    </p>
                ) : (
                    <div className="flex flex-col gap-md">
                        {sorted.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                isTrainer={isTrainer}
                                onEdit={setEditing}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ))}

            {/* 작성 가능한 후기 탭 (사용자만) */}
            {tab === 'writable' && !isTrainer && (
                <p className="py-xl text-center text-outline">
                    작성 가능한 후기 기능은 준비 중입니다.
                </p>
            )}

            {/* 수정 모달 */}
            {editing && (
                <EditModal review={editing} onSave={handleSave} onClose={() => setEditing(null)} />
            )}
        </div>
    )
}
