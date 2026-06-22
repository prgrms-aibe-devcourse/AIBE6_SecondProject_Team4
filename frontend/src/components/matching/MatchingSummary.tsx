type MatchingSummaryProps = {
    sports: string
    level: string
    lessonType: string
    region: string
    district: string
    preferredTimeCount: number
    budgetMin: number
    budgetMax: number
    errorMessage: string
    isSubmitting: boolean
}

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

export default function MatchingSummary({
    sports,
    level,
    lessonType,
    region,
    district,
    preferredTimeCount,
    budgetMin,
    budgetMax,
    errorMessage,
    isSubmitting,
}: MatchingSummaryProps) {
    return (
        <aside className="lg:sticky lg:top-28 bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
            <div className="flex items-center gap-xs pb-sm border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <h3 className="font-headline-sm text-headline-sm">요청 요약</h3>
            </div>

            <dl className="mt-md space-y-sm text-body-sm">
                <SummaryItem label="종목" value={sports} />
                <SummaryItem label="레벨" value={level} />
                <SummaryItem label="유형" value={lessonType} />
                <SummaryItem label="지역" value={`${region} ${district}`} />
                <SummaryItem label="선호 요일" value={`${preferredTimeCount}개`} />
                <div className="flex justify-between gap-md pt-sm border-t border-outline-variant">
                    <dt className="text-on-surface-variant">예산(1회)</dt>
                    <dd className="font-bold text-primary text-right">
                        {formatPrice(budgetMin)} ~ {formatPrice(budgetMax)}
                    </dd>
                </div>
            </dl>

            {errorMessage && (
                <p className="mt-md rounded-lg bg-error-container px-sm py-xs text-body-sm text-on-error-container">
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-md w-full h-12 rounded-lg bg-primary text-on-primary font-label-bold shadow-md hover:shadow-lg active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? '매칭 결과 생성 중...' : 'AI 매칭 시작하기'}
            </button>
        </aside>
    )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-md">
            <dt className="text-on-surface-variant">{label}</dt>
            <dd className="font-semibold text-right">{value}</dd>
        </div>
    )
}
