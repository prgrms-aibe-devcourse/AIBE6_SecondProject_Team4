'use client'

import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/utils/apiClient';
import { useCallback, useEffect, useState } from 'react';










// 서버에서 받는 후기 형태 (ReviewResponse 와 일치)
export interface Review {
    id: number
    matchingId: number
    reviewerId: number
    reviewerNickname: string
    reviewerProfileImage: string | null
    trainerId: number
    trainerNickname: string
    trainerProfileImage: string | null
    rating: number
    content: string
    createdAt: string
    edited: boolean
}

export type SortOption = 'latest' | 'rating'

const PAGE_SIZE = 5

/**
 * 후기 관리 훅 (역할별 분기 + 페이징 + 정렬)
 *
 * - 사용자(USER):   GET /api/reviews/my        내가 쓴 후기
 * - 트레이너(TRAINER): GET /api/reviews/received  받은 후기
 * - PUT/DELETE /api/reviews/{reviewId}  수정/삭제 (사용자 전용)
 *
 * 정렬은 백엔드에서 처리 (페이징과 호환): 최신순 / 별점 높은순
 */
export function useMyReviews() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [page, setPage] = useState(0) // 0-based
    const [totalPages, setTotalPages] = useState(0)
    const [sort, setSortState] = useState<SortOption>('latest')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 정렬 변경 시 첫 페이지로 리셋
    const setSort = useCallback((next: SortOption) => {
        setSortState(next)
        setPage(0)
    }, [])

    // ── 후기 목록 불러오기 (role 분기 + 페이지 + 정렬) ──────
    const fetchMyReviews = useCallback(async () => {
        if (!user) return
        setLoading(true)
        setError(null)
        try {
            const endpoint =
                user.role === 'TRAINER' ? '/api/reviews/received' : '/api/reviews/my'

            // 백엔드 정렬 파라미터: 필드,방향
            const sortParam = sort === 'latest' ? 'createdAt,desc' : 'rating,desc'

            const { data, error } = await apiClient.GET(endpoint, {
                params: { query: { page, size: PAGE_SIZE, sort: sortParam } } as never,
                headers: { Authorization: `Bearer ${user.token}` },
            })
            if (error) throw new Error('후기를 불러오지 못했습니다.')

            const pageData = data as {
                content?: Review[]
                totalPages?: number
            }
            setReviews(pageData?.content ?? [])
            setTotalPages(pageData?.totalPages ?? 0)
        } catch (e) {
            setError(e instanceof Error ? e.message : '알 수 없는 오류')
        } finally {
            setLoading(false)
        }
    }, [user, page, sort])

    useEffect(() => {
        fetchMyReviews()
    }, [fetchMyReviews])

    // ── 후기 수정 (사용자 전용) ────────────────────────────
    const updateReview = useCallback(
        async (reviewId: number, rating: number, content: string) => {
            if (!user) return
            const { error } = await apiClient.PUT('/api/reviews/{reviewId}', {
                params: { path: { reviewId } },
                headers: { Authorization: `Bearer ${user.token}` },
                body: { rating, content },
            })
            if (error) {
                setError('후기 수정에 실패했습니다.')
                return false
            }
            await fetchMyReviews()
            return true
        },
        [user, fetchMyReviews]
    )

    // ── 후기 삭제 (사용자 전용) ────────────────────────────
    const deleteReview = useCallback(
        async (reviewId: number) => {
            if (!user) return
            const { error } = await apiClient.DELETE('/api/reviews/{reviewId}', {
                params: { path: { reviewId } },
                headers: { Authorization: `Bearer ${user.token}` },
            })
            if (error) {
                setError('후기 삭제에 실패했습니다.')
                return false
            }
            await fetchMyReviews()
            return true
        },
        [user, fetchMyReviews]
    )

    return {
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
        refetch: fetchMyReviews,
    }
}