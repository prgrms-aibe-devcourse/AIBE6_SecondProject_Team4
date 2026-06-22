'use client'

import TrainerRatingStats from '@/components/TrainerRatingStats';
import WritableReviewList from '@/components/WritableReviewList';
import { useAuth } from '@/context/AuthContext';
import { Review, useMyReviews } from '@/hooks/useMyReviews';
import { getImageUrl } from '@/utils/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';



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
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            {/* 상단: 프로필 + 별점 + (수정/삭제) */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    {(() => {
                        const img = isTrainer ? review.reviewerProfileImage : review.trainerProfileImage
                        const profileHref = !isTrainer && review.trainerProfileId ? `/trainer/${review.trainerProfileId}` : null
                        const avatar = img ? (
                            <img src={getImageUrl(img)} alt="" className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full bg-surface-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-outline-variant">person</span>
                            </div>
                        )
                        return profileHref ? (
                            <Link href={profileHref} className="flex-shrink-0 hover:opacity-80 transition-opacity">{avatar}</Link>
                        ) : avatar
                    })()}
                    <div className="min-w-0">
                        {!isTrainer && review.trainerProfileId ? (
                            <Link href={`/trainer/${review.trainerProfileId}`} className="block truncate text-body-md font-bold text-on-surface hover:text-primary transition-colors">
                                {review.trainerNickname}
                            </Link>
                        ) : (
                            <span className="block truncate text-body-md font-bold text-on-surface">
                                {isTrainer ? review.reviewerNickname : review.trainerNickname}
                            </span>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
                    <div className="flex flex-shrink-0 items-center gap-3 text-label-md self-end sm:self-start">
                        <button
                            onClick={() => onEdit(review)}
                            className="text-on-surface-variant hover:text-primary cursor-pointer"
                        >
                            수정
                        </button>
                        <span className="text-outline-variant">|</span>
                        <button
                            onClick={() => onDelete(review.id)}
                            className="text-error hover:opacity-80 cursor-pointer"
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

// 페이지네이션 (← 1 2 3 →)
function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number
    totalPages: number
    onChange: (p: number) => void
}) {
    if (totalPages <= 1) return null // 한 페이지면 안 보임

    return (
        <div className="mt-md flex items-center justify-center gap-2">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 0}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-40"
            >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onChange(i)}
                    className={`h-9 w-9 rounded-lg text-label-bold transition-colors ${
                        i === page
                            ? 'bg-primary text-on-primary'
                            : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages - 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-40"
            >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
        </div>
    )
}

type Tab = 'all' | 'writable'

/**
 * 리뷰 관리 (마이페이지)
 * - 사용자: 내가 쓴 후기 (수정/삭제 가능)
 * - 트레이너: 내가 받은 후기 (조회만)
 * 목록은 백엔드 페이징 (최신순, 5개씩)
 */
export default function MyReviewList() {
    const { user } = useAuth()
    const isTrainer = user?.role === 'TRAINER'

    const {
        reviews,
        loading,
        error,
        page,
        totalPages,
        setPage,
        sort,
        setSort,
        updateReview,
        deleteReview,
    } = useMyReviews()
    const listTopRef = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()
    const [tab, setTab] = useState<Tab>(() =>
        !isTrainer && searchParams.get('subtab') === 'writable' ? 'writable' : 'all'
    )
    const [editing, setEditing] = useState<Review | null>(null)

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
        <div ref={listTopRef} className="flex flex-col gap-sm">
            {/* 헤더: 탭 */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="overflow-x-auto border-b border-outline-variant">
                    <div className="flex min-w-max">
                        <button
                            onClick={() => setTab('all')}
                            className={`flex h-12 items-center gap-2 border-b-2 px-sm text-body-sm transition-colors cursor-pointer ${
                                tab === 'all'
                                    ? 'border-primary font-semibold text-primary'
                                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            {isTrainer ? '받은 후기' : '전체 후기'}
                        </button>
                        {!isTrainer && (
                            <button
                                onClick={() => setTab('writable')}
                                className={`flex h-12 items-center gap-2 border-b-2 px-sm text-body-sm transition-colors cursor-pointer ${
                                    tab === 'writable'
                                        ? 'border-primary font-semibold text-primary'
                                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                작성 가능한 후기
                            </button>
                        )}
                    </div>
                </div>
                {tab === 'all' && (
                    <div className="flex w-fit items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-label-md self-start sm:self-auto flex-shrink-0">
                        <button
                            onClick={() => setSort('latest')}
                            className={`cursor-pointer ${
                                sort === 'latest'
                                    ? 'font-semibold text-primary'
                                    : 'text-on-surface-variant'
                            }`}
                        >
                            최신순
                        </button>
                        <span className="text-outline-variant">|</span>
                        <button
                            onClick={() => setSort('rating')}
                            className={`cursor-pointer ${
                                sort === 'rating'
                                    ? 'font-semibold text-primary'
                                    : 'text-on-surface-variant'
                            }`}
                        >
                            별점 높은순
                        </button>
                    </div>
                )}
            </div>

            {/* 트레이너: 받은 후기 위에 평점 통계 */}
            {tab === 'all' && isTrainer && <TrainerRatingStats />}

            {/* 전체/받은 후기 탭 */}
            {tab === 'all' &&
                (loading ? (
                    <div className="flex flex-col gap-md">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-surface-container animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 rounded bg-surface-container animate-pulse" />
                                            <div className="h-4 w-32 rounded bg-surface-container animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 rounded bg-surface-container animate-pulse" style={{ width: `${70 + (i * 11) % 25}%` }} />
                                    <div className="h-3 rounded bg-surface-container animate-pulse" style={{ width: `${50 + (i * 17) % 30}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="py-xl text-center text-error">{error}</p>
                ) : reviews.length === 0 ? (
                    <div className="mt-lg flex flex-col items-center gap-md rounded-xl border-2 border-dashed border-outline-variant p-xl opacity-40">
                        <span className="material-symbols-outlined text-[48px]">reviews</span>
                        <p className="text-body-md font-label-bold">
                            {isTrainer ? '받은 후기가 없습니다.' : '작성한 후기가 없습니다.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-md">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    isTrainer={isTrainer}
                                    onEdit={setEditing}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onChange={(p) => {
                                setPage(p)
                                listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }}
                        />
                    </>
                ))}

            {/* 작성 가능한 후기 탭 (사용자만) */}
            {tab === 'writable' && !isTrainer && <WritableReviewList />}

            {/* 수정 모달 */}
            {editing && (
                <EditModal review={editing} onSave={handleSave} onClose={() => setEditing(null)} />
            )}
        </div>
    )
}
