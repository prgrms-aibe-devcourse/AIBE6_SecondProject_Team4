'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

const categories = [
    { icon: 'fitness_center', label: '헬스', active: true },
    { icon: 'self_improvement', label: '필라테스' },
    { icon: 'air', label: '요가' },
    { icon: 'timer', label: '크로스핏' },
    { icon: 'sports_tennis', label: '테니스' },
    { icon: 'golf_course', label: '골프' },
    { icon: 'pool', label: '수영' },
    { icon: 'nightlife', label: '댄스' },
]

const trainers = [
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA09pq8e0kKsbZDTF-lUdSQIOoXVn-07pIYtLl_-Zaax5ktY-YqTykDCIktBi4cbscdTLvHEwvRSn1J8dPEm5rE-Hrx0IE2cSdReJduclUxdP7ThEZXQ-EzixnyTOdUTaR-2FfZS7ZdxqsDqcdJgSEMldAVcbfT-08eEaNDNY8mg6W6zi6LfwtMFbXqqFhYPwWs6ce-X6TNlQxHKPlDRH9xBBK5MCA9FehpMFMTRfzqiin-tgxB-uhjCEuayakmauWBFGL-WA135w',
        alt: 'Male fitness trainer',
        rating: '4.9',
        name: '김민수 트레이너',
        desc: '바디프로필 전문 · 강남구',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANS3eiu5joNz0OgDfyWSG0n5JGEd8bxfMjP7hahcBnE6evfw8w4inqxaNE81XELr52Fwvkv8PSWndTmW192XnbGXoK79YG_H7GFnD9BNuGJmAV8hYvrnJtM2vCqqysWVNJRnZ4wFLQEwuGyqNi8cq8ouJR6TrtDbcXOCJ8EwVnfJxzWsNKA4WyIaivwztwWfU6zCN9xFRx872Rm2RArYIFn8_OsOtChHcUHR61M-d5YYxqwqCFSZ5SgwndzQKzSz_tm6pCjSswGw',
        alt: 'Female yoga instructor',
        rating: '4.8',
        name: '이서연 트레이너',
        desc: '체형 교정 & 요가 · 서초구',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNpZpuHpNSp8s8JVMNc8popczKvH1wIhD3Eu9jvrvnhHIo6z5nZ-0mAnlw5fNIXsQK7pHxZRRlNRlZdY7-cp8pNKM3TILuvqYFpOOUPI-jDzpednr5mLQnkEqdXx3xuheEXOFwWep4MsF2lsLmfFh2rPSh4Qc5foOXfYvdWdvrjVlRdfn3qbWDe0seA-V4_TJvzZYS6PmP5WPP-jNsYryAGWfp9JT4R0SKKPcE4kkVUxHKlP5EvB0OTYjqCkt1ogUbZQDHPd1ScQ',
        alt: 'Male HIIT trainer',
        rating: '5.0',
        name: '박준호 트레이너',
        desc: '고강도 HIIT 전문 · 송파구',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASA0uzgLYeb0CfbPrpu0fo0lIFLL8yHAF3T1rcRly0KKSH9m520u-dmSpIGxHvP1gIt8ZcQn0IatJxWrJpAci04rJCs4b9hILc8LrtCMWlAaP2A2gu7RDYZlfuv7YxgQDjkEntdU4PGvUkZzKCqouvEIVOi9NE2WXDvVcYyWobCV40FnobnyTK698CmtucSjzae9eAV2uA3A0Xefim433ZqKgyVLdzcKCjqAz2z5nWz-ftEVHIWxeU4SOou4wWdu9EdFt7TrKjsQ',
        alt: 'Female pilates trainer',
        rating: '4.9',
        name: '최윤지 트레이너',
        desc: '재활 필라테스 · 마포구',
    },
]

const reviews = [
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrr9_tt441jYIp_OxHVsLSm3vaNx758TS4EJARVAUa8RTJHRepO2uAnEiRiStNWYb_zReqM1-vGAmdUab7tnBPamqASF1C2JDkphwhbq0azHb0TqrTHssdVabGN5T97K15WDRJJGcSlulTVmK7tYlaUCWVQp78GX4wFRZBXU66EFE2E9QlHh8-woAaFU4FVurxGR7JV4WpvBDmoxXLNfPB54XKZlmBFfDDWWuVLMIqyUlOBcK2P_QUcnXny4wbpVvL9DygzT6asQ',
        name: '한정우 님',
        text: '"김민수 트레이너님 덕분에 3개월 만에 바디프로필 촬영 성공했어요! 식단부터 멘탈 관리까지 최고입니다. 운동 습관을 완전히 바꿨어요."',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASA0uzgLYeb0CfbPrpu0fo0lIFLL8yHAF3T1rcRly0KKSH9m520u-dmSpIGxHvP1gIt8ZcQn0IatJxWrJpAci04rJCs4b9hILc8LrtCMWlAaP2A2gu7RDYZlfuv7YxgQDjkEntdU4PGvUkZzKCqouvEIVOi9NE2WXDvVcYyWobCV40FnobnyTK698CmtucSjzae9eAV2uA3A0Xefim433ZqKgyVLdzcKCjqAz2z5nWz-ftEVHIWxeU4SOou4wWdu9EdFt7TrKjsQ',
        name: '최윤지 님',
        text: '"재활 목적으로 요가 시작했는데, 이서연 트레이너님의 섬세한 티칭 덕분에 통증이 정말 많이 줄었어요. 삶의 활력을 되찾은 기분입니다."',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrr9_tt441jYIp_OxHVsLSm3vaNx758TS4EJARVAUa8RTJHRepO2uAnEiRiStNWYb_zReqM1-vGAmdUab7tnBPamqASF1C2JDkphwhbq0azHb0TqrTHssdVabGN5T97K15WDRJJGcSlulTVmK7tYlaUCWVQp78GX4wFRZBXU66EFE2E9QlHh8-woAaFU4FVurxGR7JV4WpvBDmoxXLNfPB54XKZlmBFfDDWWuVLMIqyUlOBcK2P_QUcnXny4wbpVvL9DygzT6asQ',
        name: '박민아 님',
        text: '"박준호 트레이너님 프로그램은 힘들지만 확실히 효과가 있네요. 한 달 만에 체력이 눈에 띄게 좋아졌습니다. 강추합니다!"',
        hiddenOnMd: true,
    },
]

function StarRating() {
    return (
        <div className="flex gap-0.5 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                >
                    star
                </span>
            ))}
        </div>
    )
}

export default function Home() {
    const router = useRouter()
    const [sport, setSport] = useState('')
    const [region, setRegion] = useState('')
    const [level, setLevel] = useState('')

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (sport) params.set('sport', sport)
        if (region) params.set('region', region)
        if (level) params.set('level', level)
        router.push(`/trainer?${params.toString()}`)
    }

    const handleCategoryClick = (label: string) => {
        router.push(`/trainer?sport=${encodeURIComponent(label)}`)
    }

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
                                <select
                                    className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary"
                                    value={sport}
                                    onChange={(e) => setSport(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option>헬스</option>
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
                                <select
                                    className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option>서울</option>
                                    <option>부산</option>
                                    <option>대구</option>
                                    <option>인천</option>
                                    <option>광주</option>
                                    <option>대전</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block font-label-md text-secondary ml-1">
                                    난이도
                                </label>
                                <select
                                    className="w-full bg-surface-container border-none rounded-xl text-body-md px-4 py-3 focus:ring-2 focus:ring-primary"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option value="">전체</option>
                                    <option>입문/초보</option>
                                    <option>중급</option>
                                    <option>고급/대회준비</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    className="w-full h-[52px] bg-primary text-on-primary rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:shadow-lg active:scale-[0.98] transition-all"
                                    onClick={handleSearch}
                                >
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
                            <div
                                key={label}
                                className="flex flex-col items-center gap-3 group cursor-pointer"
                                onClick={() => handleCategoryClick(label)}
                            >
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
                        <button className="text-primary font-label-bold text-label-bold flex items-center gap-1 hover:underline">
                            전체보기
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                        {trainers.map((trainer) => (
                            <div
                                key={trainer.name}
                                className="group rounded-2xl overflow-hidden shadow-lg relative bg-surface-container"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt={trainer.alt}
                                    src={trainer.src}
                                />
                                <div className="absolute inset-0 trainer-card-overlay flex flex-col justify-end p-6">
                                    <div className="flex items-center gap-1 mb-2">
                                        <span
                                            className="material-symbols-outlined text-primary-container text-sm"
                                            style={{
                                                fontVariationSettings: '"FILL" 1',
                                            }}
                                        >
                                            star
                                        </span>
                                        <span className="text-white text-sm font-label-bold">
                                            {trainer.rating}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-headline-sm text-headline-sm">
                                        {trainer.name}
                                    </h4>
                                    <p className="text-white/80 text-body-sm mt-1">
                                        {trainer.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reviews */}
                <section className="pb-xl">
                    <h2 className="font-headline-md text-headline-md mb-8">리얼 후기</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        {reviews.map((review) => (
                            <div
                                key={review.name}
                                className={`bg-surface-container-low p-6 rounded-2xl border border-outline-variant hover:shadow-md transition-shadow ${
                                    review.hiddenOnMd ? 'hidden lg:block' : ''
                                }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="w-16 h-16 rounded-full object-cover shadow-sm"
                                        alt="User profile"
                                        src={review.src}
                                    />
                                    <div>
                                        <p className="font-label-bold text-label-bold">
                                            {review.name}
                                        </p>
                                        <StarRating />
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface italic leading-relaxed">
                                    {review.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
