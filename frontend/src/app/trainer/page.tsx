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
            <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                {/* 필터 - 한 줄 */}
                <div className="flex flex-wrap gap-4 items-end mb-6 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4">
                    <div className="space-y-1">
                        <label className="block text-xs text-secondary font-label-md">종목</label>
                        <select
                            className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-sm"
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
                    <div className="space-y-1">
                        <label className="block text-xs text-secondary font-label-md">지역</label>
                        <select
                            className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-sm"
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
                    <div className="space-y-1">
                        <label className="block text-xs text-secondary font-label-md">
                            레슨 형태
                        </label>
                        <div className="flex gap-1">
                            {[
                                { label: '전체', value: '' },
                                { label: '1:1', value: 'ONE_TO_ONE' },
                                { label: '그룹', value: 'GROUP' },
                            ].map(({ label, value }) => (
                                <button
                                    key={label}
                                    className={`px-3 py-2 rounded-xl text-sm font-label-bold border transition-all ${
                                        filters.lessonType === value
                                            ? 'bg-primary text-on-primary border-primary'
                                            : 'bg-surface-container border-outline-variant text-secondary hover:border-primary'
                                    }`}
                                    onClick={() => setFilters((f) => ({ ...f, lessonType: value }))}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs text-secondary font-label-md">
                            가격 범위
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 w-24 text-sm"
                                placeholder="최소"
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, minPrice: e.target.value }))
                                }
                            />
                            <span className="text-secondary text-sm">~</span>
                            <input
                                className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 w-24 text-sm"
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
                        className="bg-primary text-on-primary px-5 py-2 rounded-xl font-label-bold text-sm hover:shadow-lg active:scale-95 transition-all"
                        onClick={fetchTrainers}
                    >
                        검색
                    </button>
                </div>

                {/* 결과 수 + 정렬 */}
                {!loading && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-secondary text-sm">
                            {trainers.length}명의 트레이너를 찾았습니다
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-secondary text-sm">정렬:</span>
                            <select className="bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5 text-sm">
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
                    <div className="text-center py-20 text-secondary">
                        <span className="material-symbols-outlined text-6xl mb-4 block">
                            search_off
                        </span>
                        <p>트레이너가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="group rounded-2xl overflow-hidden border border-outline-variant bg-surface-container cursor-pointer hover:shadow-lg transition-all"
                                    onClick={() => router.push(`/trainer/${trainer.id}`)}
                                >
                                    {/* 이미지 - 세로형 */}
                                    <div
                                        className="w-full bg-surface-container-high flex items-center justify-center overflow-hidden relative"
                                        style={{ height: '200px' }}
                                    >
                                        {trainer.profileImage ? (
                                            <img
                                                src={trainer.profileImage}
                                                alt={trainer.nickname ?? ''}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-6xl text-outline">
                                                person
                                            </span>
                                        )}
                                        <button
                                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="material-symbols-outlined text-sm text-secondary">
                                                favorite
                                            </span>
                                        </button>
                                    </div>

                                    {/* 정보 */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-label-bold">{trainer.nickname}</p>
                                            <div className="flex items-center gap-0.5">
                                                <span
                                                    className="material-symbols-outlined text-xs text-primary"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span className="text-xs font-label-bold">4.9</span>
                                            </div>
                                        </div>
                                        <p className="text-secondary text-xs mt-1 line-clamp-2 min-h-[2rem]">
                                            {trainer.introduction ?? '소개가 없습니다.'}
                                        </p>
                                        {/* 태그 */}
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                            {trainer.sports && (
                                                <span className="text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
                                                    {trainer.sports}
                                                </span>
                                            )}
                                            {trainer.lessonType && (
                                                <span className="text-xs bg-surface-container-high text-secondary px-2 py-0.5 rounded-full">
                                                    {trainer.lessonType === 'ONE_TO_ONE'
                                                        ? '1:1'
                                                        : '그룹 레슨'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <p className="text-xs text-secondary">최저 가격</p>
                                                <p className="font-label-bold text-sm">
                                                    {trainer.price?.toLocaleString()}원
                                                </p>
                                            </div>
                                            <button
                                                className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded-lg font-label-bold hover:shadow active:scale-95 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/trainer/${trainer.id}`)
                                                }}
                                            >
                                                매칭하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이징 */}
                        <div className="flex justify-center gap-1 mt-10">
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-label-bold transition-all ${
                                        page === 1
                                            ? 'bg-primary text-on-primary'
                                            : 'border border-outline-variant hover:bg-surface-container'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="w-9 h-9 flex items-center justify-center text-secondary">
                                ...
                            </span>
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-sm hover:bg-surface-container">
                                12
                            </button>
                            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container">
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
