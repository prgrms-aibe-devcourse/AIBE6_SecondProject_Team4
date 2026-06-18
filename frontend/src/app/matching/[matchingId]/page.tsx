import Link from 'next/link'

type MatchingResultPageProps = {
    params: Promise<{
        matchingId: string
    }>
}

export default async function MatchingResultPage({ params }: MatchingResultPageProps) {
    const { matchingId } = await params

    return (
        <main className="pt-16 md:pt-20">
            <section className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="min-h-[420px] flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-5xl text-primary">
                        recommend
                    </span>
                    <h1 className="mt-md font-headline-md text-headline-md text-on-surface">
                        AI 매칭 결과
                    </h1>
                    <p className="mt-xs text-body-md text-on-surface-variant">
                        매칭 요청 #{matchingId}의 추천 결과 페이지입니다.
                    </p>
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                        다음 단계에서 추천 트레이너 목록을 연결합니다.
                    </p>
                    <Link
                        href="/matching"
                        className="mt-md inline-flex h-11 items-center justify-center rounded-lg border border-primary px-md font-label-bold text-primary hover:bg-primary-fixed"
                    >
                        조건 다시 입력하기
                    </Link>
                </div>
            </section>
        </main>
    )
}
