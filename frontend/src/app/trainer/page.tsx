'use client'

import { REGIONS as REGION_OPTIONS } from '@/constants/matchingOptions'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import { formatLessonType } from '@/utils/lessonDisplay'
import { Suspense, useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']

const SPORTS = [
    '모든 종목',
    '헬스',
    '필라테스',
    '요가',
    '크로스핏',
    '테니스',
    '골프',
    '수영',
    '댄스',
]

const LESSON_LEVELS = ['전체', '입문/초보', '중급', '고급/대회준비']

function ExplorePageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // URL에서 직접 읽어오는 "적용된" 필터/페이지/정렬 값
    const sport = searchParams.get('sport') ?? ''
    const region = searchParams.get('region') ?? ''
    const lessonLevel = searchParams.get('level') ?? ''
    const lessonType = searchParams.get('lessonType') ?? ''
    const minPrice = searchParams.get('minPrice') ?? ''
    const maxPrice = searchParams.get('maxPrice') ?? ''
    const currentPage = Number(searchParams.get('page') ?? '0')
    const sort = searchParams.get('sort') ?? 'reviewDesc'

    const [trainers, setTrainers] = useState<Trainer[]>([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    // 검색창에서 "입력 중인" 임시 필터 값 (검색 버튼 눌러야 URL/적용 값으로 반영)
    const [showPriceFilter, setShowPriceFilter] = useState(false)
    const [draftPrice, setDraftPrice] = useState({ minPrice, maxPrice })

    const fetchTrainers = async (retried = false) => {
        setLoading(true)
        const query = {
            sport: sport || undefined,
            lessonType: lessonType || undefined,
            lessonLevel: lessonLevel || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            region: region || undefined,
            page: currentPage,
            size: 8,
            sort,
        }
        const { data, response } = await getAuthClient().GET('/api/trainers', {
            params: { query },
        })
        if (data) {
            setTrainers((data as any).content ?? [])
            setTotalPages((data as any).totalPages ?? 0)
            setTotalElements((data as any).totalElements ?? 0)
            setLoading(false)
        } else if (response.status === 401 && !retried) {
            // 미들웨어가 토큰을 갱신했지만 data가 올라오지 않은 경우 — 새 토큰으로 1회 재시도
            fetchTrainers(true)
        } else {
            setLoading(false)
        }
    }

    // URL(쿼리 파라미터)이 바뀔 때마다 그 값으로 다시 조회
    useEffect(() => {
        fetchTrainers()
        // draftFilters는 검색창 입력용이라 의도적으로 의존성에서 제외
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sport, region, lessonLevel, lessonType, minPrice, maxPrice, currentPage, sort])

    // 검색창 입력값을 바탕으로 쿼리스트링 만들어서 push하는 공통 함수
    const pushQuery = (
        next: Partial<{
            sport: string
            region: string
            lessonLevel: string
            lessonType: string
            minPrice: string
            maxPrice: string
            page: number
            sort: string
        }>
    ) => {
        const params = new URLSearchParams(searchParams.toString())

        const merged = {
            sport,
            region,
            lessonLevel,
            lessonType,
            minPrice,
            maxPrice,
            page: currentPage,
            sort,
            ...next,
        }

        const setOrDelete = (key: string, value: string) => {
            if (value) params.set(key, value)
            else params.delete(key)
        }

        setOrDelete('sport', merged.sport)
        setOrDelete('region', merged.region)
        setOrDelete('level', merged.lessonLevel)
        setOrDelete('lessonType', merged.lessonType)
        setOrDelete('minPrice', merged.minPrice)
        setOrDelete('maxPrice', merged.maxPrice)
        setOrDelete('sort', merged.sort === 'reviewDesc' ? '' : merged.sort)

        if (merged.page > 0) params.set('page', String(merged.page))
        else params.delete('page')

        router.push(`/trainer?${params.toString()}`, { scroll: false })
    }

    const handlePriceApply = () => {
        pushQuery({ minPrice: draftPrice.minPrice, maxPrice: draftPrice.maxPrice, page: 0 })
        setShowPriceFilter(false)
    }

    const handlePageChange = (page: number) => {
        pushQuery({ page })
    }

    const handleSortChange = (value: string) => {
        pushQuery({ sort: value, page: 0 })
    }

    const PAGE_GROUP_SIZE = 5

    const getPageNumbers = () => {
        const groupIndex = Math.floor(currentPage / PAGE_GROUP_SIZE)
        const start = groupIndex * PAGE_GROUP_SIZE
        const end = Math.min(totalPages - 1, start + PAGE_GROUP_SIZE - 1)
        const pages = []
        for (let i = start; i <= end; i++) pages.push(i)
        return pages
    }
    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg">
                {/* 필터 */}
                <div className="flex flex-wrap items-start gap-2 md:gap-sm mb-md md:mb-lg relative">
                    <div className="flex flex-col gap-xs">
                        <label className="text-label-md font-label-md text-on-surface-variant">
                            종목
                        </label>
                        <select
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-sm text-body-md h-11 w-36"
                            value={sport}
                            onChange={(e) =>
                                pushQuery({
                                    sport: e.target.value === '모든 종목' ? '' : e.target.value,
                                    page: 0,
                                })
                            }
                        >
                            {SPORTS.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-xs">
                        <label className="text-label-md font-label-md text-on-surface-variant">
                            지역
                        </label>
                        <select
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-sm text-body-md h-11 w-36"
                            value={region}
                            onChange={(e) =>
                                pushQuery({
                                    region: e.target.value === '모든 지역' ? '' : e.target.value,
                                    page: 0,
                                })
                            }
                        >
                            <option value="모든 지역">모든 지역</option>
                            {REGION_OPTIONS.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-xs">
                        <label className="text-label-md font-label-md text-on-surface-variant">
                            레슨 형태
                        </label>
                        <div className="flex gap-xs h-11">
                            {[
                                { label: '전체', value: '' },
                                { label: '1:1', value: 'ONE_TO_ONE' },
                                { label: '그룹', value: 'GROUP' },
                            ].map(({ label, value }) => (
                                <button
                                    key={label}
                                    className={`px-sm md:px-md h-11 rounded-lg text-label-bold font-label-bold transition-all border cursor-pointer ${
                                        lessonType === value
                                            ? 'bg-primary text-on-primary border-primary'
                                            : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                    onClick={() => pushQuery({ lessonType: value, page: 0 })}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                        <label className="text-label-md font-label-md text-on-surface-variant">
                            난이도
                        </label>
                        <select
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-sm text-body-md h-11 w-36"
                            value={lessonLevel}
                            onChange={(e) =>
                                pushQuery({
                                    lessonLevel: e.target.value === '전체' ? '' : e.target.value,
                                    page: 0,
                                })
                            }
                        >
                            {LESSON_LEVELS.map((l) => (
                                <option key={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-xs relative">
                        <label className="text-label-md font-label-md text-on-surface-variant">
                            가격
                        </label>
                        <button
                            className={`h-11 px-sm rounded-lg border text-body-sm text-left w-24 truncate transition-all cursor-pointer ${
                                minPrice || maxPrice
                                    ? 'border-primary text-primary bg-primary-fixed'
                                    : 'bg-primary-fixed/40 border-primary/30 text-primary'
                            }`}
                            onClick={() => {
                                setDraftPrice({ minPrice, maxPrice })
                                setShowPriceFilter((prev) => !prev)
                            }}
                        >
                            {minPrice || maxPrice
                                ? `${minPrice ? Math.round(Number(minPrice) / 1000) + '천' : '0'}~${maxPrice ? Math.round(Number(maxPrice) / 1000) + '천' : '∞'}`
                                : '범위설정'}
                        </button>

                        {showPriceFilter && (
                            <div className="absolute top-full left-0 mt-1 z-10 flex items-center gap-xs bg-surface-container-lowest border border-outline-variant rounded-lg p-sm shadow-lg">
                                <input
                                    className="bg-surface-container-low border border-outline-variant rounded-lg px-sm text-body-md h-11 w-20 md:w-24"
                                    placeholder="최소"
                                    type="number"
                                    value={draftPrice.minPrice}
                                    onChange={(e) =>
                                        setDraftPrice((f) => ({ ...f, minPrice: e.target.value }))
                                    }
                                />
                                <span className="text-on-surface-variant">-</span>
                                <input
                                    className="bg-surface-container-low border border-outline-variant rounded-lg px-sm text-body-md h-11 w-20 md:w-24"
                                    placeholder="최대"
                                    type="number"
                                    value={draftPrice.maxPrice}
                                    onChange={(e) =>
                                        setDraftPrice((f) => ({ ...f, maxPrice: e.target.value }))
                                    }
                                />
                                <button
                                    className="bg-primary text-on-primary px-sm h-11 rounded-lg font-label-bold hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                    onClick={handlePriceApply}
                                >
                                    적용
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 결과 수 + 정렬 */}
                {loading ? (
                    <div className="flex justify-between items-center mb-md">
                        <div className="h-5 w-40 rounded bg-surface-container animate-pulse" />
                        <div className="h-8 w-28 rounded-lg bg-surface-container animate-pulse" />
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-md">
                        <p className="text-body-md text-on-surface">
                            <span className="font-bold">{totalElements}명</span>의 트레이너를
                            찾았습니다
                        </p>
                        <div className="flex items-center gap-xs self-end sm:self-auto">
                            <span className="text-body-sm text-on-surface-variant">정렬:</span>
                            <select
                                className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-body-sm"
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="reviewDesc">후기 많은순</option>
                                <option value="priceAsc">가격 낮은순</option>
                                <option value="priceDesc">가격 높은순</option>
                                <option value="careerDesc">경력순</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* 트레이너 목록 */}
                {trainers.length === 0 && !loading ? (
                    <div className="text-center py-20 text-on-surface-variant">
                        <span className="material-symbols-outlined text-6xl mb-4 block">
                            search_off
                        </span>
                        <p className="text-body-lg">트레이너가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter transition-opacity duration-200 ${
                                loading ? 'opacity-40' : 'opacity-100'
                            }`}
                        >
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="group rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest cursor-pointer flex flex-col"
                                    style={{
                                        boxShadow: '0 4px 20px rgba(116,119,129,0.08)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    }}
                                    onClick={() => router.push(`/trainer/${trainer.id}`)}
                                    onMouseEnter={(e) => {
                                        ;(e.currentTarget as HTMLDivElement).style.transform =
                                            'translateY(-2px)'
                                        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                                            '0 8px 30px rgba(116,119,129,0.12)'
                                    }}
                                    onMouseLeave={(e) => {
                                        ;(e.currentTarget as HTMLDivElement).style.transform =
                                            'translateY(0)'
                                        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                                            '0 4px 20px rgba(116,119,129,0.08)'
                                    }}
                                >
                                    <div
                                        className="w-full bg-surface-container flex items-center justify-center overflow-hidden relative flex-shrink-0"
                                        style={{ height: '200px' }}
                                    >
                                        {trainer.profileImage ? (
                                            <img
                                                src={getImageUrl(trainer.profileImage)}
                                                alt={trainer.nickname ?? ''}
                                                className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                                                onLoad={(e) => {
                                                    e.currentTarget.classList.remove('opacity-0')
                                                }}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-6xl text-outline-variant">
                                                person
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3 md:p-md flex flex-col flex-grow">
                                        <div className="flex items-center justify-between mb-xs">
                                            <p className="font-headline-sm text-body-md md:text-headline-sm text-on-surface truncate">
                                                {trainer.nickname}
                                            </p>
                                            <div className="flex items-center gap-xs flex-shrink-0 ml-xs">
                                                <span
                                                    className="material-symbols-outlined text-sm text-tertiary"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span className="text-body-sm font-bold">
                                                    {trainer.averageRating
                                                        ? trainer.averageRating.toFixed(1)
                                                        : '신규'}
                                                </span>
                                                {trainer.reviewCount != null &&
                                                    trainer.reviewCount > 0 && (
                                                        <span className="text-body-sm text-on-surface-variant">
                                                            ({trainer.reviewCount})
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                        <p
                                            className="text-body-sm text-on-surface-variant mb-2 md:mb-sm"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                minHeight: '40px',
                                            }}
                                        >
                                            {trainer.introduction ?? '소개가 없습니다.'}
                                        </p>
                                        <div
                                            className="flex gap-1 md:gap-xs flex-wrap mb-2 md:mb-sm"
                                            style={{ minHeight: '28px' }}
                                        >
                                            {trainer.sports
                                                ?.split(',')
                                                .slice(0, 2)
                                                .map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-label-md font-label-md bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded"
                                                    >
                                                        {s.trim()}
                                                    </span>
                                                ))}
                                            {trainer.lessonType && (
                                                <span className="text-label-md font-label-md bg-surface-container text-on-surface-variant px-sm py-xs rounded">
                                                    {formatLessonType(trainer.lessonType)}
                                                </span>
                                            )}
                                            {trainer.lessonLevel
                                                ?.split(',')
                                                .slice(0, 1)
                                                .map((level, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-label-md font-label-md bg-emerald-100 text-emerald-700 px-sm py-xs rounded"
                                                    >
                                                        {level.trim()}
                                                    </span>
                                                ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant">
                                            <div className="min-w-0">
                                                <p className="text-label-md font-label-md text-on-surface-variant">
                                                    회당 가격
                                                </p>
                                                <p className="text-body-md font-bold text-on-surface truncate">
                                                    {trainer.price?.toLocaleString()}원
                                                </p>
                                            </div>
                                            <button
                                                className="bg-primary text-on-primary px-2 md:px-md py-sm rounded-lg text-label-bold font-label-bold hover:shadow active:scale-95 transition-all flex-shrink-0 ml-2 md:ml-sm text-xs md:text-sm cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(
                                                        `/lesson-requests/new/trainer/${trainer.id}`
                                                    )
                                                }}
                                            >
                                                예약하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이징 */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-xs mt-lg">
                                <button
                                    className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition disabled:opacity-50 cursor-pointer"
                                    onClick={() => handlePageChange(getPageNumbers()[0] - 1)}
                                    disabled={getPageNumbers()[0] === 0}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        chevron_left
                                    </span>
                                </button>

                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-label-bold font-label-bold transition-all cursor-pointer ${
                                            page === currentPage
                                                ? 'bg-primary text-on-primary'
                                                : 'border border-outline-variant hover:bg-surface-container text-on-surface'
                                        }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition disabled:opacity-50 cursor-pointer"
                                    onClick={() =>
                                        handlePageChange(
                                            getPageNumbers()[getPageNumbers().length - 1] + 1
                                        )
                                    }
                                    disabled={
                                        getPageNumbers()[getPageNumbers().length - 1] ===
                                        totalPages - 1
                                    }
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        chevron_right
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
export default function ExplorePage() {
    return (
        <Suspense fallback={null}>
            <ExplorePageContent />
        </Suspense>
    )
}
