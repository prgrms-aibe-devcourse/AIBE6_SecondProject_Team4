'use client'

import type { components } from '@/types/api'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

type Trainer = components['schemas']['TrainerProfileResponse']

const SPORTS = ['모든 종목', 'PT', '필라테스', '요가', '크로스핏', '테니스', '골프', '수영', '댄스']
const REGIONS = ['모든 지역', '서울', '경기', '부산', '대구', '인천', '광주', '대전']

export default function ExplorePage() {
    const router = useRouter()
    const [trainers, setTrainers] = useState<Trainer[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        sport: '',
        lessonType: '',
        minPrice: '',
        maxPrice: '',
        region: '',
    })

    const fetchTrainers = async () => {
        setLoading(true)
        const client = getAuthClient()
        const { data } = await client.GET('/api/trainers', {
            params: {
                query: {
                    sport: filters.sport || undefined,
                    lessonType: filters.lessonType || undefined,
                    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
                    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
                    region: filters.region || undefined,
                },
            },
        })
        setTrainers(data ?? [])
        setLoading(false)
    }

    useEffect(() => {
        fetchTrainers()
    }, [])

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-[1440px] mx-auto px-margin-desktop py-lg">
                {/* 필터 */}
                <div className="flex flex-wrap items-end gap-md mb-lg">
                    <div className="space-y-xs">
                        <label className="block text-label-md font-label-md text-on-surface-variant">
                            종목
                        </label>
                        <select
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md min-w-[160px]"
                            value={filters.sport}
                            onChange={(e) =>
                                setFilters((f) => ({
                                    ...f,
                                    sport: e.target.value === '모든 종목' ? '' : e.target.value,
                                }))
                            }
                        >
                            {SPORTS.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-xs">
                        <label className="block text-label-md font-label-md text-on-surface-variant">
                            지역
                        </label>
                        <select
                            className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md min-w-[160px]"
                            value={filters.region}
                            onChange={(e) =>
                                setFilters((f) => ({
                                    ...f,
                                    region: e.target.value === '모든 지역' ? '' : e.target.value,
                                }))
                            }
                        >
                            {REGIONS.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-xs">
                        <label className="block text-label-md font-label-md text-on-surface-variant">
                            레슨 형태
                        </label>
                        <div className="flex gap-xs">
                            {[
                                { label: '전체', value: '' },
                                { label: '1:1', value: 'ONE_TO_ONE' },
                                { label: '그룹', value: 'GROUP' },
                            ].map(({ label, value }) => (
                                <button
                                    key={label}
                                    className={`px-md py-sm rounded-lg text-label-bold font-label-bold transition-all ${
                                        filters.lessonType === value
                                            ? 'bg-primary text-on-primary'
                                            : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                    onClick={() => setFilters((f) => ({ ...f, lessonType: value }))}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-xs">
                        <label className="block text-label-md font-label-md text-on-surface-variant">
                            가격 범위
                        </label>
                        <div className="flex items-center gap-xs">
                            <input
                                className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md w-28"
                                placeholder="최소"
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, minPrice: e.target.value }))
                                }
                            />
                            <span className="text-on-surface-variant">-</span>
                            <input
                                className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md w-28"
                                placeholder="최대"
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                    <button
                        className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-bold hover:shadow-lg active:scale-95 transition-all"
                        onClick={fetchTrainers}
                    >
                        검색
                    </button>
                </div>

                {/* 결과 수 + 정렬 */}
                {!loading && (
                    <div className="flex justify-between items-center mb-md">
                        <p className="text-body-md text-on-surface">
                            <span className="font-bold">{trainers.length}명</span>의 트레이너를
                            찾았습니다
                        </p>
                        <div className="flex items-center gap-xs">
                            <span className="text-body-sm text-on-surface-variant">정렬:</span>
                            <select className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-body-sm">
                                <option>인기순</option>
                                <option>가격 낮은순</option>
                                <option>가격 높은순</option>
                                <option>경력순</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* 트레이너 목록 */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                            progress_activity
                        </span>
                    </div>
                ) : trainers.length === 0 ? (
                    <div className="text-center py-20 text-on-surface-variant">
                        <span className="material-symbols-outlined text-6xl mb-4 block">
                            search_off
                        </span>
                        <p className="text-body-lg">트레이너가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="group rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest cursor-pointer transition-all"
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
                                    {/* 이미지 */}
                                    <div
                                        className="w-full bg-surface-container flex items-center justify-center overflow-hidden relative"
                                        style={{ height: '200px' }}
                                    >
                                        {trainer.profileImage ? (
                                            <img
                                                src={trainer.profileImage}
                                                alt={trainer.nickname ?? ''}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-6xl text-outline-variant">
                                                person
                                            </span>
                                        )}
                                        <button
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                                favorite
                                            </span>
                                        </button>
                                    </div>

                                    {/*카드 정보 부분*/}
                                    <div className="p-md flex flex-col h-[200px]">
                                        <div className="flex items-center justify-between mb-xs">
                                            <p className="font-headline-sm text-headline-sm text-on-surface truncate">
                                                {trainer.nickname}
                                            </p>
                                            <div className="flex items-center gap-xs flex-shrink-0">
                                                <span
                                                    className="material-symbols-outlined text-sm text-tertiary"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span className="text-body-sm font-bold">4.9</span>
                                            </div>
                                        </div>
                                        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-sm flex-shrink-0 min-h-[40px]">
                                            {trainer.introduction ?? '소개가 없습니다.'}
                                        </p>
                                        <div className="flex gap-xs flex-wrap mb-sm flex-shrink-0 min-h-[28px]">
                                            {trainer.sports && (
                                                <span className="text-label-md font-label-md bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded truncate max-w-[120px]">
                                                    {trainer.sports}
                                                </span>
                                            )}
                                            {trainer.lessonType && (
                                                <span className="text-label-md font-label-md bg-surface-container text-on-surface-variant px-sm py-xs rounded">
                                                    {trainer.lessonType === 'ONE_TO_ONE'
                                                        ? '1:1'
                                                        : '그룹 레슨'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div>
                                                <p className="text-label-md font-label-md text-on-surface-variant">
                                                    최당 가격
                                                </p>
                                                <p className="text-headline-sm font-headline-sm text-on-surface">
                                                    {trainer.price?.toLocaleString()}원
                                                </p>
                                            </div>
                                            <button
                                                className="bg-primary text-on-primary px-md py-sm rounded-lg text-label-bold font-label-bold hover:shadow active:scale-95 transition-all flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/trainer/${trainer.id}`)
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
                        <div className="flex justify-center gap-xs mt-lg">
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-label-bold font-label-bold transition-all ${
                                        page === 1
                                            ? 'bg-primary text-on-primary'
                                            : 'border border-outline-variant hover:bg-surface-container text-on-surface'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="w-9 h-9 flex items-center justify-center text-on-surface-variant">
                                ...
                            </span>
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-label-bold font-label-bold hover:bg-surface-container text-on-surface transition">
                                12
                            </button>
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}
