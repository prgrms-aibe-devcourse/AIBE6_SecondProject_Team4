'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { apiClient, getImageUrl } from '@/utils/apiClient'

const categories = [
    { icon: 'fitness_center', label: 'PT', active: true },
    { icon: 'self_improvement', label: '필라테스' },
    { icon: 'air', label: '요가' },
    { icon: 'timer', label: '크로스핏' },
    { icon: 'sports_tennis', label: '테니스' },
    { icon: 'golf_course', label: '골프' },
    { icon: 'pool', label: '수영' },
    { icon: 'nightlife', label: '댄스' },
]

// 인기 트레이너 (PopularTrainerResponse)
interface PopularTrainer {
    trainerId: number
    trainerProfileId: number | null
    nickname: string
    profileImage: string | null
    sports: string | null
    region: string | null
    averageRating: number
    reviewCount: number
}

// 리얼 후기 (RealReviewResponse)
interface RealReview {
    id: number
    reviewerNickname: string
    trainerNickname: string
    rating: number
    content: string
    createdAt: string
}

// 별점 (채워진 개수만큼)
function StarRating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={i < rating ? { fontVariationSettings: '"FILL" 1' } : undefined}
                >
                    star
                </span>
            ))}
        </div>
    )
}

export default function Home() {
    const router = useRouter()
    const [trainers, setTrainers] = useState<PopularTrainer[]>([])
    const [reviews, setReviews] = useState<RealReview[]>([])

    useEffect(() => {
        const fetchMainData = async () => {
            const [pt, rv] = await Promise.all([
                apiClient.GET('/api/reviews/popular-trainers', {
                    params: { query: { size: 4 } } as never,
                }),
                apiClient.GET('/api/reviews/real', {
                    params: { query: { size: 3 } } as never,
                }),
            ])
            setTrainers((pt.data as PopularTrainer[]) ?? [])
            setReviews((rv.data as RealReview[]) ?? [])
        }
        fetchMainData()
    }, [])

    return (
        <main className="pt-16 md:pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[500px] md:h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="w-full h-full object-cover grayscale-[10%]"
                        alt="A dynamic fitness photography shot featuring an athlete in mid-movement during a high-intensity workout."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_tNDFTjxdIq_n2jZHBaZvq1XI-SFInkwx6GL3Emi7ReXCxQpgPhwYyA93AoDhJqknTvFZjlgp9b1WanN-xTQlRTxsU27ApktORj4jXEnFXrk3W88L9-A6qoqF-IE8skzfs4QL2nyjfLYcLhm7Pw6_aHRzpJ6eHXdr8jRJiJof2LmtX_3Xt56X-juhZq3cpCceBXuQYfv2l_rzBpVHcK2HQnksa2qLf7h55syyBzlj3md828E13Z7y6RolJ24YwnMmhOWIjF9x_g"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-screen-xl mx-auto w-full px-margin-mobile md:px-margin-desktop space-y-xl">
                    <div className="max-w-2xl space-y-md">
                        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background leading-tight">
                            나만의 인생
                            <br />
                            트레이너를
                            <br />
                            만나보세요
                        </h1>
                        <p className="text-body-lg text-secondary max-w-[28rem] hidden md:block">
                            검증된 전문가와 함께하는 맞춤형 피트니스 여정, <br />
                            당신의 목표를 현실로 만들어 드립니다.
                        </p>
                    </div>

                    <div className="bg-surface-container-lowest/90 backdrop-blur rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl border border-outline-variant">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary ml-1">
                                    종목
                                </label>
                                <select className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary">
                                    <option value="">전체</option>
                                    <option>PT</option>
                                    <option>필라테스</option>
                                    <option>요가</option>
                                    <option>크로스핏</option>
                                    <option>테니스</option>
                                    <option>골프</option>
                                    <option>수영</option>
                                    <option>댄스</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary ml-1">
                                    지역
                                </label>
                                <select className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary">
                                    <option value="">전체</option>
                                    <option>서울특별시</option>
                                    <option>부산광역시</option>
                                    <option>대구광역시</option>
                                    <option>인천광역시</option>
                                    <option>광주광역시</option>
                                    <option>대전광역시</option>
                                    <option>울산광역시</option>
                                    <option>세종특별자치시</option>
                                    <option>경기도</option>
                                    <option>강원도</option>
                                    <option>충청북도</option>
                                    <option>충청남도</option>
                                    <option>전라북도</option>
                                    <option>전라남도</option>
                                    <option>경상북도</option>
                                    <option>경상남도</option>
                                    <option>제주특별자치도</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary ml-1">
                                    난이도
                                </label>
                                <select className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary">
                                    <option>초급</option>
                                    <option>중급</option>
                                    <option>고급</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button className="w-full h-[52px] bg-primary text-on-primary rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:shadow-lg active:scale-[0.98] transition-all">
                                    <span className="material-symbols-outlined">search</span>
                                    트레이너 찾기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop">
                {/* Category Grid */}
                <section className="py-xl">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-gutter">
                        {categories.map(({ icon, label, active }) => (
                            <div key={label} className="flex flex-col items-center gap-3 group">
                                <div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all cursor-pointer shadow-sm ${
                                        active
                                            ? 'bg-primary-fixed text-primary'
                                            : 'bg-surface-container text-secondary group-hover:bg-primary-fixed group-hover:text-primary'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-3xl">
                                        {icon}
                                    </span>
                                </div>
                                <span
                                    className={`font-label-bold text-label-bold ${
                                        active ? '' : 'text-secondary group-hover:text-on-surface'
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Matching Banner */}
                <section className="pb-xl">
                    <div className="kinetic-gradient rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-md border border-outline-variant">
                        <div className="space-y-4 z-10 text-center md:text-left">
                            <div className="inline-block bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
                                AI 맞춤 추천 서비스
                            </div>
                            <h3 className="font-display-lg-mobile md:text-headline-md text-on-surface">
                                당신에게 딱 맞는 최고의 전문가를
                                <br className="hidden md:block" />
                                AI 분석으로 빠르게 추천받아 보세요.
                            </h3>
                            <p className="text-body-md text-on-surface-variant md:max-w-[32rem]">
                                현재 운동 목표, 선호하는 시간대, 그리고 원하는 스타일까지 모두
                                고려하여 최적의 매칭을 진행합니다.
                            </p>
                            <button className="mt-4 bg-inverse-surface text-surface px-10 py-3 rounded-xl font-label-bold text-label-bold hover:shadow-xl active:scale-95 transition-all">
                                지금 바로 시작하기
                            </button>
                        </div>
                        <div className="opacity-10 absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span
                                className="material-symbols-outlined text-[300px] text-primary"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                psychology
                            </span>
                        </div>
                    </div>
                </section>

                {/* Top Trainers */}
                <section className="pb-xl">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="font-headline-md text-headline-md">이달의 인기 트레이너</h2>
                        <button
                            onClick={() => router.push('/trainer')}
                            className="text-primary font-label-bold text-label-bold flex items-center gap-1 hover:underline"
                        >
                            전체보기
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    {trainers.length === 0 ? (
                        <p className="py-lg text-center text-on-surface-variant">
                            아직 인기 트레이너 정보가 없습니다.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            {trainers.map((trainer) => (
                                <div
                                    key={trainer.trainerId}
                                    onClick={() =>
                                        trainer.trainerProfileId &&
                                        router.push(`/trainer/${trainer.trainerProfileId}`)
                                    }
                                    className="group rounded-2xl overflow-hidden shadow-lg relative bg-surface-container cursor-pointer"
                                >
                                    {trainer.profileImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt={trainer.nickname}
                                            src={getImageUrl(trainer.profileImage)}
                                        />
                                    ) : (
                                        <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-primary-fixed to-primary-fixed-dim">
                                            <span className="material-symbols-outlined text-8xl text-on-primary-fixed/40">
                                                person
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 trainer-card-overlay flex flex-col justify-end p-6">
                                        <div className="flex items-center gap-1 mb-2">
                                            <span
                                                className="material-symbols-outlined text-primary-container text-sm"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span className="text-white text-sm font-label-bold">
                                                {trainer.averageRating}
                                            </span>
                                            <span className="text-white/70 text-sm">
                                                (후기 {trainer.reviewCount})
                                            </span>
                                        </div>
                                        <h4 className="text-white font-headline-sm text-headline-sm">
                                            {trainer.nickname}
                                        </h4>
                                        <p className="text-white/80 text-body-sm mt-1">
                                            {trainer.sports ?? '전문 트레이너'}
                                            {trainer.region ? ` · ${trainer.region}` : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reviews */}
                <section className="pb-xl">
                    <h2 className="font-headline-md text-headline-md mb-8">리얼 후기</h2>
                    {reviews.length === 0 ? (
                        <p className="py-lg text-center text-on-surface-variant">
                            아직 등록된 후기가 없습니다.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                            {reviews.map((review, idx) => (
                                <div
                                    key={review.id}
                                    className={`bg-surface-container-low p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-shadow ${
                                        idx === 2 ? 'hidden lg:block' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-outline-variant text-3xl">
                                                person
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-label-bold text-label-bold">
                                                {review.reviewerNickname} 님
                                            </p>
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface italic leading-relaxed">
                                        &ldquo;{review.content}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}