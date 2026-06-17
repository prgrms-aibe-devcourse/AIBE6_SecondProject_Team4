'use client'

import { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/utils/apiClient'

// 백엔드 TrainerRatingResponse 와 일치
interface TrainerRating {
    trainerId: number
    averageRating: number
    reviewCount: number
    ratingDistribution: Record<number, number> // { 5: 8, 4: 3, ... }
}

// 별점 표시 (평균값 기준, 채움/빈 — 0.5 단위는 반올림 처리)
function AverageStars({ rating }: { rating: number }) {
    const rounded = Math.round(rating)
    return (
        <div className="flex text-tertiary">
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    className="material-symbols-outlined text-[20px]"
                    style={i <= rounded ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
          star
        </span>
            ))}
        </div>
    )
}

// 별점 분포 막대 한 줄
function DistributionBar({
                             star,
                             count,
                             total,
                         }: {
    star: number
    count: number
    total: number
}) {
    const percent = total > 0 ? (count / total) * 100 : 0
    return (
        <div className="flex items-center gap-2">
      <span className="w-6 text-right text-label-md text-on-surface-variant">
        {star}점
      </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                <div
                    className="h-full rounded-full bg-tertiary transition-all"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className="w-8 text-left text-label-md text-on-surface-variant">
        {count}
      </span>
        </div>
    )
}

export default function TrainerRatingStats() {
    const { user } = useAuth()
    const [rating, setRating] = useState<TrainerRating | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const fetchRating = async () => {
            setLoading(true)
            try {
                // 트레이너 본인의 평점 통계 (공개 API, trainerId = 본인 memberId)
                const { data, error } = await apiClient.GET(
                    '/api/reviews/trainer/{trainerId}/rating',
                    {
                        params: { path: { trainerId: user.memberId } },
                        headers: { Authorization: `Bearer ${user.token}` },
                    },
                )
                if (!error && data) {
                    setRating(data as TrainerRating)
                }
            } catch {
                // 통계는 부가 정보라, 실패해도 화면 전체를 막지 않음
            } finally {
                setLoading(false)
            }
        }
        fetchRating()
    }, [user])

    if (loading) {
        return (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md text-center text-outline">
                통계 불러오는 중...
            </div>
        )
    }

    // 후기가 없으면 통계 박스 숨김 (받은 후기 빈 상태 메시지로 충분)
    if (!rating || rating.reviewCount === 0) {
        return null
    }

    return (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
            <div className="flex flex-col gap-md md:flex-row md:items-center md:gap-lg">
                {/* 좌: 평균 평점 */}
                <div className="flex flex-shrink-0 flex-col items-center justify-center gap-1 md:w-40">
          <span className="text-display-lg font-headline-md text-on-surface">
            {rating.averageRating.toFixed(1)}
          </span>
                    <AverageStars rating={rating.averageRating} />
                    <span className="text-label-md text-on-surface-variant">
            후기 {rating.reviewCount}개
          </span>
                </div>

                {/* 우: 별점 분포 (5점 → 1점) */}
                <div className="flex flex-1 flex-col gap-1.5">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <DistributionBar
                            key={star}
                            star={star}
                            count={rating.ratingDistribution[star] ?? 0}
                            total={rating.reviewCount}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}