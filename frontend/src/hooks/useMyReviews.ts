'use client'

import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/utils/apiClient'
import { useCallback, useEffect, useState } from 'react'

// 서버에서 받는 후기 형태 (ReviewResponse 와 일치)
export interface Review {
    id: number
    matchingId: number
    reviewerId: number
    reviewerNickname: string
    trainerId: number
    rating: number
    content: string
    createdAt: string
    edited: boolean
}

/**
 * 내가 작성한 후기 관리 훅
 *
 * ── 사용법 ──────────────────────────────────────────────
 * const { reviews, loading, updateReview, deleteReview } = useMyReviews()
 * ────────────────────────────────────────────────────────
 *
 * - GET    /api/reviews/my          내가 쓴 후기 목록 (인증 필요)
 * - PUT    /api/reviews/{reviewId}  후기 수정 (본인만)
 * - DELETE /api/reviews/{reviewId}  후기 삭제 (본인만)
 */
export function useMyReviews() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 토큰을 Authorization 헤더로 싣기 위한 공통 옵션
    const authHeader = user ? { Authorization: `Bearer ${user.token}` } : undefined

    // ── 후기 목록 불러오기 (role에 따라 분기) ──────────────
    const fetchMyReviews = useCallback(async () => {
        if (!user) return
        setLoading(true)
        setError(null)
        try {
            // 트레이너 → 받은 후기 / 일반 사용자 → 내가 쓴 후기
            const endpoint =
                user.role === 'TRAINER' ? '/api/reviews/received' : '/api/reviews/my'

            const { data, error } = await apiClient.GET(endpoint, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            if (error) throw new Error('후기를 불러오지 못했습니다.')
            setReviews((data as Review[]) ?? [])
        } catch (e) {
            setError(e instanceof Error ? e.message : '알 수 없는 오류')
        } finally {
            setLoading(false)
        }
    }, [user])

    // 마운트 시 + 로그인 상태 바뀔 때 불러오기
    useEffect(() => {
        fetchMyReviews()
    }, [fetchMyReviews])

    // ── 후기 수정 ──────────────────────────────────────────
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
            await fetchMyReviews() // 수정 후 목록 새로고침
            return true
        },
        [user, fetchMyReviews]
    )

    // ── 후기 삭제 ──────────────────────────────────────────
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
            // 삭제된 후기를 목록에서 즉시 제거 (낙관적 업데이트)
            setReviews((prev) => prev.filter((r) => r.id !== reviewId))
            return true
        },
        [user]
    )

    return { reviews, loading, error, updateReview, deleteReview, refetch: fetchMyReviews }
}
