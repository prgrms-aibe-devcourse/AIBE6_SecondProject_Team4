'use client'

import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']
type ReviewResponse = components['schemas']['ReviewResponse']
type TrainerRating = components['schemas']['TrainerRatingResponse']

interface Props {
    params: Promise<{ id: string }>
}

export default function TrainerDetailPage({ params }: Props) {
    const router = useRouter()
    const [trainer, setTrainer] = useState<Trainer | null>(null)
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState<string>('')
    const [showAllPhotos, setShowAllPhotos] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [rating, setRating] = useState<TrainerRating | null>(null)
    const [showAllReviews, setShowAllReviews] = useState(false)

    useEffect(() => {
        params.then(({ id }) => setId(id))
    }, [params])

    useEffect(() => {
        if (!id) return
        const fetchTrainer = async () => {
            const client = getAuthClient()
            const { data } = await client.GET('/api/trainers/{id}', {
                params: { path: { id: Number(id) } },
            })
            setTrainer(data ?? null)
            setLoading(false)
        }
        fetchTrainer()
    }, [id])

    // 공개 후기 + 평점 불러오기 (trainer.memberId 기준)
    useEffect(() => {
        if (!trainer?.memberId) return
        const fetchReviews = async () => {
            const client = getAuthClient()
            const [rv, rt] = await Promise.all([
                client.GET('/api/reviews/trainer/{trainerId}', {
                    params: { path: { trainerId: trainer.memberId! } },
                }),
                client.GET('/api/reviews/trainer/{trainerId}/rating', {
                    params: { path: { trainerId: trainer.memberId! } },
                }),
            ])
            setReviews(rv.data ?? [])
            setRating(rt.data ?? null)
        }
        fetchReviews()
    }, [trainer?.memberId])

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                </span>
            </main>
        )
    }

    if (!trainer) {
        return (
            <main className="pt-16 md:pt-20">
                <div className="max-w-[1440px] mx-auto px-margin-desktop py-lg text-center">
                    <p className="text-on-surface-variant">트레이너를 찾을 수 없습니다.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-[1440px] mx-auto px-margin-desktop py-lg">
                {/* 뒤로가기 */}
                <button
                    className="flex items-center gap-xs text-on-surface-variant mb-md hover:text-on-surface transition"
                    onClick={() => router.back()}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    돌아보기
                </button>

                {/* 상단 프로필 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
                    {/* 왼쪽 이미지 */}
                    <div className="md:col-span-1">
                        <div className="w-full aspect-square bg-surface-container rounded-2xl flex items-center justify-center overflow-hidden">
                            {trainer.profileImage ? (
                                <img
                                    src={getImageUrl(trainer.profileImage)}
                                    alt={trainer.nickname ?? ''}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-8xl text-outline-variant">
                                    person
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽 정보 */}
                    <div className="md:col-span-2 space-y-md">
                        {/* 태그 */}
                        <div className="flex gap-xs flex-wrap">
                            {trainer.sports?.split(',').map((s, i) => (
                                <span
                                    key={i}
                                    className="text-label-md font-label-md bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-full"
                                >
                                    {s.trim()}
                                </span>
                            ))}
                        </div>

                        {/* 이름 */}
                        <h1 className="font-headline-md text-headline-md text-on-surface">
                            {trainer.nickname}
                        </h1>

                        {/* 별점 */}
                        <div className="flex items-center gap-xs">
                            <span
                                className="material-symbols-outlined text-sm text-tertiary"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                star
                            </span>
                            <span className="font-bold text-body-md">
                                {rating && rating.reviewCount ? rating.averageRating : '-'}
                            </span>
                            <span className="text-on-surface-variant text-body-sm">
                                (후기 {rating?.reviewCount ?? 0}개)
                            </span>
                        </div>

                        {/* 소개 */}
                        <p className="text-body-md text-on-surface-variant">
                            {trainer.introduction ?? '소개가 없습니다.'}
                        </p>

                        {/* 기본 스탯 */}
                        <div className="flex gap-lg">
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant">
                                    경력
                                </p>
                                <p className="font-bold text-on-surface">
                                    {trainer.careerYears ?? '-'}년 이상
                                </p>
                            </div>
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant">
                                    누적 세션
                                </p>
                                <p className="font-bold text-on-surface">5,000+ 회</p>
                            </div>
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant">
                                    활동 지역
                                </p>
                                <p className="font-bold text-on-surface">{trainer.region ?? '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 상세 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    {/* 왼쪽 - 전문분야/레슨유형/레슨수준/수업사진/회원후기 */}
                    <div className="md:col-span-2 space-y-lg">
                        {/* 전문 분야 + 수업 유형 */}
                        <div className="grid grid-cols-2 gap-md">
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                                <div className="flex items-center gap-xs mb-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        fitness_center
                                    </span>
                                    <p className="font-label-bold text-on-surface">전문 분야</p>
                                </div>
                                <div className="flex flex-wrap gap-xs">
                                    {trainer.sports?.split(',').map((s, i) => (
                                        <span
                                            key={i}
                                            className="text-label-md font-label-md bg-surface-container text-on-surface-variant px-sm py-xs rounded"
                                        >
                                            {s.trim()}
                                        </span>
                                    )) ?? (
                                        <span className="text-body-sm text-on-surface-variant">
                                            미설정
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* 전문 분야 + 레슨 유형 */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                                <div className="flex items-center gap-xs mb-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        assignment
                                    </span>
                                    <p className="font-label-bold text-on-surface">수업 유형</p>
                                </div>
                                <div className="space-y-xs">
                                    <div className="flex items-center gap-xs">
                                        <span className="material-symbols-outlined text-sm text-primary">
                                            check_circle
                                        </span>
                                        <span className="text-body-sm">
                                            {trainer.lessonType === 'ONE_TO_ONE'
                                                ? '1:1 퍼스널 트레이닝'
                                                : trainer.lessonType === 'GROUP'
                                                    ? '그룹 레슨'
                                                    : '온라인 코칭'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 레슨 수준 */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                            <div className="flex items-center gap-xs mb-sm">
                                <span className="material-symbols-outlined text-primary text-sm">
                                    bar_chart
                                </span>
                                <p className="font-label-bold text-on-surface">레슨 수준</p>
                            </div>
                            <div className="flex gap-sm flex-wrap">
                                {trainer.lessonLevel?.split(',').map((level, i) => (
                                    <div key={i} className="flex items-center gap-xs">
                                        <span className="material-symbols-outlined text-sm text-primary">
                                            check
                                        </span>
                                        <span className="text-body-sm text-on-surface-variant">
                                            {level.trim()}
                                        </span>
                                    </div>
                                )) ?? (
                                    <span className="text-body-sm text-on-surface-variant">
                                        미설정
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 수업 사진 */}
                        <div>
                            <div className="flex items-center justify-between mb-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    수업 사진
                                </h2>
                                {trainer.lessonPhotos && trainer.lessonPhotos.length > 4 && (
                                    <button
                                        className="text-primary text-body-sm font-label-bold hover:underline"
                                        onClick={() => setShowAllPhotos((prev) => !prev)}
                                    >
                                        {showAllPhotos ? '접기 ↑' : '전체 보기 →'}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-sm">
                                {trainer.lessonPhotos && trainer.lessonPhotos.length > 0
                                    ? (showAllPhotos
                                            ? trainer.lessonPhotos
                                            : trainer.lessonPhotos.slice(0, 4)
                                    ).map((photoUrl, i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-surface-container rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedPhoto(photoUrl)}
                                        >
                                            <img
                                                src={getImageUrl(photoUrl)}
                                                alt={`수업 사진 ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))
                                    : [1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-surface-container rounded-xl flex items-center justify-center"
                                        >
                                              <span className="material-symbols-outlined text-outline-variant">
                                                  image
                                              </span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* 회원 후기 */}
                        <div>
                            <div className="flex items-center gap-sm mb-md">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    회원 후기
                                </h2>
                                {rating && rating.reviewCount ? (
                                    <div className="flex items-center gap-xs">
                                        <span
                                            className="material-symbols-outlined text-sm text-tertiary"
                                            style={{ fontVariationSettings: '"FILL" 1' }}
                                        >
                                            star
                                        </span>
                                        <span className="font-bold">{rating.averageRating}</span>
                                    </div>
                                ) : null}
                            </div>

                            {reviews.length === 0 ? (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center text-on-surface-variant text-body-sm">
                                    아직 작성된 후기가 없습니다.
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-md">
                                        {(showAllReviews ? reviews : reviews.slice(0, 3)).map(
                                            (review) => (
                                                <div
                                                    key={review.id}
                                                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md"
                                                >
                                                    <div className="flex items-center gap-sm mb-sm">
                                                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-outline-variant">
                                                                person
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-label-bold text-on-surface">
                                                                {review.reviewerNickname}
                                                            </p>
                                                            <p className="text-label-md font-label-md text-on-surface-variant">
                                                                {review.createdAt?.slice(0, 10).replace(/-/g, '.')}
                                                                {review.edited ? ' (수정됨)' : ''}
                                                            </p>
                                                        </div>
                                                        <div className="ml-auto flex">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                <span
                                                                    key={i}
                                                                    className="material-symbols-outlined text-sm text-tertiary"
                                                                    style={
                                                                        i <= (review.rating ?? 0)
                                                                            ? { fontVariationSettings: '"FILL" 1' }
                                                                            : undefined
                                                                    }
                                                                >
                                                                    star
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-body-sm text-on-surface-variant">
                                                        {review.content}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* 더보기 / 접기 (후기 3개 초과일 때만) */}
                                    {reviews.length > 3 && (
                                        <button
                                            className="w-full mt-md py-sm border border-outline-variant rounded-xl text-label-bold font-label-bold text-on-surface hover:bg-surface-container transition"
                                            onClick={() => setShowAllReviews((prev) => !prev)}
                                        >
                                            {showAllReviews
                                                ? '접기 ↑'
                                                : `후기 전체 보기 (${reviews.length}개) →`}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 오른쪽 - 가격/매칭 버튼 (sticky) */}
                    <div className="md:col-span-1">
                        <div
                            className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-2xl p-md space-y-md"
                            style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                        >
                            <div>
                                <p className="text-headline-md font-headline-md text-on-surface">
                                    ₩{trainer.price?.toLocaleString()}
                                    <span className="text-body-md font-normal text-on-surface-variant ml-xs">
                                        / 세션
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-xs">
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-on-surface-variant">10회 패키지</span>
                                    <span className="font-bold">
                                        ₩{((trainer.price ?? 0) * 10 * 0.9).toLocaleString()}{' '}
                                        <span className="text-primary text-label-md">10%</span>
                                    </span>
                                </div>
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-on-surface-variant">상담 비용</span>
                                    <span className="font-bold text-primary">무료</span>
                                </div>
                            </div>
                            <button className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all">
                                매칭 요청하기
                            </button>
                            <button className="w-full border border-outline-variant text-on-surface py-sm rounded-xl font-label-bold hover:bg-surface-container transition flex items-center justify-center gap-xs">
                                <span className="material-symbols-outlined text-sm">chat</span>
                                {trainer.nickname}와 상담하기
                            </button>
                            <div className="space-y-xs pt-sm border-t border-outline-variant">
                                <div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                                    <span className="material-symbols-outlined text-sm">
                                        schedule
                                    </span>
                                    평균 응답: 2시간 이내
                                </div>
                                <div className="flex items-start gap-xs text-body-sm text-on-surface-variant">
                                    <span className="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">
                                        calendar_month
                                    </span>
                                    <span>
                                        활동 시간:{' '}
                                        {trainer.availableTimes && trainer.availableTimes.length > 0
                                            ? (() => {
                                                const dayMap: Record<string, string> = {
                                                    MON: '월',
                                                    TUE: '화',
                                                    WED: '수',
                                                    THU: '목',
                                                    FRI: '금',
                                                    SAT: '토',
                                                    SUN: '일',
                                                }
                                                const days = trainer.availableTimes
                                                    .map(
                                                        (t) =>
                                                            dayMap[t.dayOfWeek ?? ''] ??
                                                            t.dayOfWeek
                                                    )
                                                    .join(', ')
                                                const first = trainer.availableTimes[0]
                                                const startTime =
                                                    first?.startTime?.substring(0, 5) ?? ''
                                                const endTime =
                                                    first?.endTime?.substring(0, 5) ?? ''
                                                return `${days} · ${startTime} - ${endTime}`
                                            })()
                                            : '미설정'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 사진 확대보기 모달 */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-lg"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>
                    <img
                        src={getImageUrl(selectedPhoto)}
                        alt="수업 사진 확대"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    )
}