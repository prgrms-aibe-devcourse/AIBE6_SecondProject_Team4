'use client'

import MatchingForm from '@/components/matching/MatchingForm'
import { useState } from 'react'

export default function MatchingPage() {
    const [quickQuery, setQuickQuery] = useState('')

    return (
        <main className="pt-16 md:pt-20">
            <section className="bg-primary-fixed/45 border-b border-outline-variant/40">
                <div className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop min-h-[360px] md:min-h-[450px] flex flex-col items-center justify-center text-center py-xl">
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
                        나에게 맞는 트레이너를 한 줄로 찾아보세요
                    </h1>
                    <p className="mt-sm text-body-sm md:text-body-md text-on-surface-variant">
                        운동 목표, 지역, 시간대를 자유롭게 입력하면 AI가 조건을 해석해
                        추천해드립니다.
                    </p>

                    <div className="mt-md w-full max-w-3xl flex items-center gap-xs bg-surface-container-lowest border border-outline-variant rounded-lg p-xs shadow-lg">
                        <input
                            value={quickQuery}
                            onChange={(event) => setQuickQuery(event.target.value)}
                            className="min-w-0 flex-1 h-12 px-sm bg-transparent text-body-md outline-none placeholder:text-outline"
                            placeholder="예: 강남에서 월, 수 저녁에 필라테스 1:1 받고 싶어요"
                            aria-label="AI 트레이너 추천 문장"
                        />
                        <button
                            type="button"
                            className="h-12 px-md rounded-lg bg-primary text-on-primary font-label-bold whitespace-nowrap disabled:opacity-40"
                            disabled={!quickQuery.trim()}
                        >
                            AI 추천받기
                        </button>
                    </div>
                </div>
            </section>

            <section className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="mb-md">
                    <p className="text-label-bold font-label-bold text-primary">AI MATCHING</p>
                    <h2 className="mt-xs font-headline-md text-headline-md text-on-surface">
                        AI 맞춤 매칭 요청
                    </h2>
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                        원하는 운동 스타일과 조건을 입력하면 적합한 트레이너를 찾아드립니다.
                    </p>
                </div>

                <MatchingForm />
            </section>
        </main>
    )
}
