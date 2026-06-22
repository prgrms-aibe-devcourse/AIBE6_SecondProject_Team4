'use client'

import MatchingForm, { type MatchingDraft } from '@/components/matching/MatchingForm'
import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/utils/apiClient'
import { FormEvent, useState } from 'react'

import { useRouter } from 'next/navigation'

export default function MatchingPage() {
    const router = useRouter()
    const { user } = useAuth()

    const [quickQuery, setQuickQuery] = useState('')
    const [parsedDraft, setParsedDraft] = useState<MatchingDraft | null>(null)
    const [quickError, setQuickError] = useState('')
    const [isParsing, setIsParsing] = useState(false)

    const handleQuickSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const query = quickQuery.trim()

        if (!query) {
            return
        }

        if (!user) {
            router.push('/auth/login')
            return
        }

        setIsParsing(true)
        setQuickError('')

        try {
            const client = getAuthClient()

            const { data, error } = await client.POST('/api/ai/matching/parse', {
                body: {
                    query,
                },
            })

            if (error || !data) {
                setQuickError('문장을 해석하지 못했습니다. 아래 폼에서 직접 입력해 주세요.')
                return
            }

            /*
             * lessonContent에는 원문이 항상 들어가므로,
             * 실제 조건 필드가 하나라도 해석됐는지 별도로 확인합니다.
             */
            const hasParsedCondition =
                Boolean(data.sports) ||
                Boolean(data.level) ||
                Boolean(data.lessonType) ||
                Boolean(data.region) ||
                typeof data.budgetMin === 'number' ||
                typeof data.budgetMax === 'number' ||
                Boolean(data.preferredTimes?.length)

            if (!hasParsedCondition) {
                setQuickError('구체적인 운동 종목, 지역, 수준 또는 시간을 입력해 주세요.')
                return
            }

            setParsedDraft({
                sports: data.sports,
                level: data.level,
                lessonType: data.lessonType,
                region: data.region,
                budgetMin: data.budgetMin,
                budgetMax: data.budgetMax,
                preferredTimes: data.preferredTimes,
                lessonContent: data.lessonContent,
            })

            window.setTimeout(() => {
                document.getElementById('matching-form')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }, 0)
        } catch {
            setQuickError('AI 서비스에 연결할 수 없습니다. 아래 폼에서 직접 입력해 주세요.')
        } finally {
            setIsParsing(false)
        }
    }

    return (
        <main className="pt-16 md:pt-20">
            <section className="border-b border-outline-variant/40 bg-primary-fixed/45">
                <div className="mx-auto flex min-h-[360px] max-w-screen-xl flex-col items-center justify-center px-margin-mobile py-xl text-center md:min-h-[450px] md:px-margin-desktop">
                    <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface md:font-display-lg md:text-display-lg">
                        나에게 맞는 트레이너를 한 줄로 찾아보세요
                    </h1>

                    <p className="mt-sm text-body-sm text-on-surface-variant md:text-body-md">
                        운동 목표, 지역, 시간대를 자유롭게 입력하면 AI가 조건을 해석해
                        추천해드립니다.
                    </p>

                    <form
                        onSubmit={handleQuickSearch}
                        className="mt-md flex w-full max-w-3xl items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest p-xs shadow-lg"
                    >
                        <input
                            value={quickQuery}
                            onChange={(event) => setQuickQuery(event.target.value)}
                            maxLength={500}
                            className="h-12 min-w-0 flex-1 bg-transparent px-sm text-body-md outline-none placeholder:text-outline"
                            placeholder="예: 강남에서 월, 수 저녁에 필라테스 1:1 받고 싶어요"
                            aria-label="AI 트레이너 추천 문장"
                        />

                        <button
                            type="submit"
                            className="h-12 whitespace-nowrap rounded-lg bg-primary px-md font-label-bold text-on-primary disabled:opacity-40 cursor-pointer"
                            disabled={!quickQuery.trim() || isParsing}
                        >
                            {isParsing ? '분석 중...' : 'AI 추천받기'}
                        </button>
                    </form>

                    {quickError && <p className="mt-sm text-body-sm text-error">{quickError}</p>}
                </div>
            </section>

            <section
                id="matching-form"
                className="mx-auto max-w-screen-xl scroll-mt-24 px-margin-mobile py-xl md:px-margin-desktop"
            >
                <div className="mb-md">
                    <p className="font-label-bold text-label-bold text-primary">AI MATCHING</p>

                    <h2 className="mt-xs font-headline-md text-headline-md text-on-surface">
                        AI 맞춤 매칭 요청
                    </h2>

                    <p className="mt-xs text-body-sm text-on-surface-variant">
                        원하는 운동 스타일과 조건을 입력하면 적합한 트레이너를 찾아드립니다.
                    </p>
                </div>

                <MatchingForm initialDraft={parsedDraft} />
            </section>
        </main>
    )
}
