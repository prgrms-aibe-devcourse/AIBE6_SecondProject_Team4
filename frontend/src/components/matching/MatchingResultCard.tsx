import type { components } from '@/types/api'
import { formatLessonType } from '@/utils/lessonDisplay'

import Link from 'next/link'

type MatchingResult = components['schemas']['MatchingResultResponse']

type MatchingResultCardProps = {
    result: MatchingResult
    onLessonRequest: (matchingResultId: number) => void
}

export default function MatchingResultCard({ result, onLessonRequest }: MatchingResultCardProps) {
    const recommendationReason =
        result.aiReason ??
        (result.aiRank
            ? '요청한 종목, 레슨 수준, 유형, 지역, 예산과 선호 시간 조건을 모두 충족하는 트레이너입니다.'
            : undefined)

    const tags = [
        result.sports,
        result.lessonType ? formatLessonType(result.lessonType) : undefined,
        result.lessonLevel,
        result.region,
    ].filter((tag): tag is string => Boolean(tag))

    return (
        <article className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
            <div className="aspect-[4/3] bg-surface-container">
                {result.profileImage ? (
                    <img
                        src={result.profileImage}
                        alt={`${result.trainerName ?? '트레이너'} 프로필`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-outline">
                            person
                        </span>
                    </div>
                )}
            </div>

            <div className="p-md">
                <div className="flex items-start justify-between gap-sm">
                    <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            {result.trainerName ?? '트레이너'}
                        </h2>
                        <div className="mt-xs flex flex-wrap gap-1.5">
                            {tags.map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="rounded-full bg-primary-fixed px-2.5 py-1 text-label-sm text-on-primary-fixed"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-secondary-container px-2.5 py-1 text-label-sm text-on-secondary-container">
                        {result.aiRank ? `추천 ${result.aiRank}순위` : '조건 일치'}
                    </span>
                </div>

                <p className="mt-md min-h-12 text-body-sm leading-6 text-on-surface-variant">
                    {result.introduction || '트레이너 소개가 아직 등록되지 않았습니다.'}
                </p>

                {recommendationReason && (
                    <div className="mt-md border-l-2 border-primary bg-primary-fixed/35 px-sm py-xs">
                        <p className="flex items-center gap-1.5 font-label-bold text-label-sm text-primary">
                            <span
                                className="material-symbols-outlined text-base"
                                aria-hidden="true"
                            >
                                auto_awesome
                            </span>
                            추천 이유
                        </p>
                        <p className="mt-1 text-body-sm leading-6 text-on-surface-variant">
                            {recommendationReason}
                        </p>
                    </div>
                )}

                <dl className="mt-md space-y-xs rounded-lg bg-surface-container-low p-sm text-body-sm">
                    <div className="flex items-center justify-between gap-sm">
                        <dt className="text-body-sm font-medium text-on-surface-variant">
                            가능한 요일
                        </dt>
                        <dd className="text-body-sm font-medium text-on-surface">
                            {result.dayOfWeek ?? '-'}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between gap-sm">
                        <dt className="text-body-sm font-medium text-primary">상세 시간</dt>
                        <dd className="text-body-sm font-medium text-primary">
                            레슨 요청에서 선택
                        </dd>
                    </div>
                </dl>

                <div className="mt-md border-t border-outline-variant pt-md">
                    <p className="text-label-sm text-on-surface-variant">1회 가격</p>
                    <strong className="mt-1 block text-title-lg text-on-surface">
                        {result.price?.toLocaleString('ko-KR') ?? '-'}원
                    </strong>
                </div>

                <div className="mt-md grid grid-cols-2 gap-xs">
                    {result.trainerProfileId ? (
                        <Link
                            href={`/trainer/${result.trainerProfileId}`}
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-primary font-label-bold text-primary hover:bg-primary-fixed"
                        >
                            프로필 보기
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="h-11 rounded-lg border border-outline-variant text-outline"
                        >
                            프로필 보기
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={!result.matchingResultId}
                        onClick={() => {
                            if (result.matchingResultId) {
                                onLessonRequest(result.matchingResultId)
                            }
                        }}
                        className="h-11 rounded-lg bg-primary font-label-bold text-on-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-outline-variant"
                    >
                        레슨 요청하기
                    </button>
                </div>
            </div>
        </article>
    )
}
