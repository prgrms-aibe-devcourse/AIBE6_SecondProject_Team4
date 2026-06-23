'use client'

import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { formatLessonType } from '@/utils/lessonDisplay'
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
    const { user } = useAuth()
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
            <main className="pt-16 md:pt-20">
                <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg">
                    {/* 뒤로가기 */}
                    <div className="h-5 w-20 rounded bg-surface-container animate-pulse mb-md" />

                    {/* 상단 프로필 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
                        {/* 프로필 이미지 */}
                        <div className="md:col-span-1">
                            <div className="w-full aspect-square bg-surface-container rounded-2xl animate-pulse" />
                        </div>
                        {/* 프로필 정보 */}
                        <div className="md:col-span-2 space-y-md">
                            <div className="flex gap-xs flex-wrap">
                                {[60, 80, 50].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-6 rounded-full bg-surface-container animate-pulse"
                                        style={{ width: `${w}px` }}
                                    />
                                ))}
                            </div>
                            <div className="h-8 w-48 rounded-lg bg-surface-container animate-pulse" />
                            <div className="h-5 w-32 rounded bg-surface-container animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                                <div className="h-4 w-4/5 rounded bg-surface-container animate-pulse" />
                                <div className="h-4 w-3/5 rounded bg-surface-container animate-pulse" />
                            </div>
                            <div className="flex gap-lg">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="h-3 w-10 rounded bg-surface-container animate-pulse" />
                                        <div className="h-5 w-16 rounded bg-surface-container animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 하단 상세 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <div className="md:col-span-2 space-y-lg">
                            {/* 전문분야 + 수업유형 */}
                            <div className="grid grid-cols-2 gap-md">
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-sm"
                                    >
                                        <div className="h-4 w-20 rounded bg-surface-container animate-pulse" />
                                        <div className="flex gap-xs flex-wrap">
                                            {[50, 70].map((w, j) => (
                                                <div
                                                    key={j}
                                                    className="h-6 rounded bg-surface-container animate-pulse"
                                                    style={{ width: `${w}px` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* 레슨 수준 */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-sm">
                                <div className="h-4 w-20 rounded bg-surface-container animate-pulse" />
                                <div className="flex gap-sm flex-wrap">
                                    {[60, 80, 70].map((w, i) => (
                                        <div
                                            key={i}
                                            className="h-5 rounded bg-surface-container animate-pulse"
                                            style={{ width: `${w}px` }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* 수업 사진 */}
                            <div>
                                <div className="h-6 w-24 rounded bg-surface-container animate-pulse mb-sm" />
                                <div className="grid grid-cols-4 gap-sm">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="aspect-square bg-surface-container rounded-xl animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* 후기 */}
                            <div className="space-y-md">
                                <div className="h-6 w-24 rounded bg-surface-container animate-pulse" />
                                {[1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-sm"
                                    >
                                        <div className="flex items-center gap-sm">
                                            <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
                                            <div className="space-y-1 flex-1">
                                                <div className="h-4 w-24 rounded bg-surface-container animate-pulse" />
                                                <div className="h-3 w-32 rounded bg-surface-container animate-pulse" />
                                            </div>
                                            <div className="h-4 w-20 rounded bg-surface-container animate-pulse" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-3 w-full rounded bg-surface-container animate-pulse" />
                                            <div className="h-3 w-4/5 rounded bg-surface-container animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽 가격 카드 */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-2xl p-md space-y-md">
                                <div className="h-8 w-36 rounded bg-surface-container animate-pulse" />
                                <div className="space-y-xs">
                                    <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                                    <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                                </div>
                                <div className="h-11 w-full rounded-xl bg-surface-container animate-pulse" />
                                <div className="h-11 w-full rounded-xl bg-surface-container animate-pulse" />
                                <div className="space-y-xs pt-sm border-t border-outline-variant">
                                    <div className="h-4 w-3/4 rounded bg-surface-container animate-pulse" />
                                    <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

    const isOwner = user?.memberId === trainer.memberId

    if (trainer.isPublic === false && !isOwner) {
        return (
            <main className="pt-16 md:pt-20">
                <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg">
                    <button
                        className="flex items-center gap-xs text-on-surface-variant mb-md hover:text-on-surface transition cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        돌아보기
                    </button>
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <span className="material-symbols-outlined text-6xl text-outline-variant mb-md">
                            lock
                        </span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                            비공개로 설정된 프로필입니다
                        </h2>
                        <p className="text-body-md text-on-surface-variant">
                            트레이너가 프로필을 비공개로 전환했습니다.
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg">
                {/* 뒤로가기 */}
                <button
                    className="flex items-center gap-xs text-on-surface-variant mb-md hover:text-on-surface transition cursor-pointer"
                    onClick={() => router.back()}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    돌아보기
                </button>

                {/* 상단 프로필 섹션 */}
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-md md:gap-lg mb-md md:mb-lg">
                    {/* 이미지 */}
                    <div className="sm:col-span-1">
                        <div className="w-full max-w-[280px] sm:max-w-none mx-auto aspect-square bg-surface-container rounded-2xl flex items-center justify-center overflow-hidden">
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

                    {/* 정보 */}
                    <div className="sm:col-span-2 space-y-3 md:space-y-md">
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
                        <p className="text-body-sm md:text-body-md text-on-surface-variant">
                            {trainer.introduction ?? '소개가 없습니다.'}
                        </p>

                        {/* 기본 스탯 */}
                        <div className="flex gap-md md:gap-lg">
                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant">
                                    경력
                                </p>
                                <p className="font-bold text-on-surface text-body-sm md:text-body-md">
                                    {trainer.careerYears ?? '-'}년 이상
                                </p>
                            </div>

                            <div>
                                <p className="text-label-md font-label-md text-on-surface-variant">
                                    활동 지역
                                </p>
                                <p className="font-bold text-on-surface text-body-sm md:text-body-md">
                                    {trainer.region ?? '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 상세 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg">
                    {/* 왼쪽 - 전문분야/레슨유형/레슨수준/수업사진/회원후기 */}
                    <div className="md:col-span-2 space-y-md md:space-y-lg order-2 md:order-1">
                        {/* 전문 분야 + 수업 유형 */}
                        <div className="grid grid-cols-2 gap-3 md:gap-md">
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 md:p-md">
                                <div className="flex items-center gap-xs mb-2 md:mb-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        fitness_center
                                    </span>
                                    <p className="font-label-bold text-on-surface text-xs md:text-sm">
                                        전문 분야
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-1 md:gap-xs">
                                    {trainer.sports?.split(',').map((s, i) => (
                                        <span
                                            key={i}
                                            className="text-label-md font-label-md bg-surface-container text-on-surface-variant px-xs md:px-sm py-xs rounded text-xs"
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
                            {/* 수업 유형 */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 md:p-md">
                                <div className="flex items-center gap-xs mb-2 md:mb-sm">
                                    <span className="material-symbols-outlined text-primary text-sm">
                                        assignment
                                    </span>
                                    <p className="font-label-bold text-on-surface text-xs md:text-sm">
                                        수업 유형
                                    </p>
                                </div>
                                <div className="space-y-xs">
                                    <div className="flex items-center gap-xs">
                                        <span className="material-symbols-outlined text-sm text-primary">
                                            check_circle
                                        </span>
                                        <span className="text-body-sm text-xs md:text-sm">
                                            {trainer.lessonType
                                                ? formatLessonType(trainer.lessonType)
                                                : '미설정'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 레슨 수준 */}
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 md:p-md">
                            <div className="flex items-center gap-xs mb-2 md:mb-sm">
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
                                        className="text-primary text-body-sm font-label-bold hover:underline cursor-pointer"
                                        onClick={() => setShowAllPhotos((prev) => !prev)}
                                    >
                                        {showAllPhotos ? '접기 ↑' : '전체 보기 →'}
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-sm">
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
                                                                {review.createdAt
                                                                    ?.slice(0, 10)
                                                                    .replace(/-/g, '.')}
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
                                                                            ? {
                                                                                  fontVariationSettings:
                                                                                      '"FILL" 1',
                                                                              }
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
                                            className="w-full mt-md py-sm border border-outline-variant rounded-xl text-label-bold font-label-bold text-on-surface hover:bg-surface-container transition cursor-pointer"
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
                    <div className="md:col-span-1 order-1 md:order-2">
                        <div
                            className="md:sticky md:top-24 bg-surface-container-lowest border border-outline-variant rounded-2xl p-md space-y-md"
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
                            </div>
                            <button
                                className="w-full bg-primary text-on-primary py-sm rounded-xl font-label-bold hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                                onClick={() =>
                                    router.push(`/lesson-requests/new/trainer/${trainer.id}`)
                                }
                            >
                                매칭 요청하기
                            </button>
                            <button
                                className="w-full border border-outline-variant text-on-surface py-sm rounded-xl font-label-bold hover:bg-surface-container transition flex items-center justify-center gap-xs cursor-pointer"
                                onClick={() => {
                                    if (!user) {
                                        router.push(`/auth/login?redirect=/trainer/${trainer.id}`)
                                        return
                                    }
                                    window.dispatchEvent(
                                        new CustomEvent('open-chat-with-trainer', {
                                            detail: {
                                                trainerId: trainer.memberId,
                                                name: trainer.nickname ?? '',
                                                profileImage: trainer.profileImage ?? '',
                                            },
                                        })
                                    )
                                }}
                            >
                                <span className="material-symbols-outlined text-sm">chat</span>
                                {trainer.nickname}와 상담하기
                            </button>
                            <div className="space-y-xs pt-sm border-t border-outline-variant">
                                <div className="flex items-start gap-xs text-body-sm text-on-surface-variant">
                                    <span className="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">
                                        calendar_month
                                    </span>
                                    <span>
                                        활동 시간:{' '}
                                        {trainer.availableTimes && trainer.availableTimes.length > 0
                                            ? (() => {
                                                  const dayMap: Record<string, string> = {
                                                      MONDAY: '월',
                                                      TUESDAY: '화',
                                                      WEDNESDAY: '수',
                                                      THURSDAY: '목',
                                                      FRIDAY: '금',
                                                      SATURDAY: '토',
                                                      SUNDAY: '일',
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
                        className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer"
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
