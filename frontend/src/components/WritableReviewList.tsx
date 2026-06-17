'use client'

import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'

/**
 * 작성 가능한 후기 (매칭 성사 후 미작성 트레이너)
 *
 * ⚠️ 데이터 연동 대기 중:
 *   매칭 "성사 완료"(요구사항 37번)가 구현되면, 성사된 매칭 중
 *   아직 후기를 안 쓴 트레이너 목록을 불러와 연결한다.
 *   예상 흐름: GET /api/reviews/writable
 *     → 백엔드에서 (성사된 매칭의 트레이너) - (이미 후기 쓴 트레이너) 필터
 *   현재는 매칭 성사 API가 없어 더미 데이터로 화면만 구성.
 */

// 작성 가능한 후기 대상 (매칭 성사된 트레이너) — 임시 타입
interface WritableTarget {
    matchingId: number // 후기 작성 시 필요 (어떤 매칭에 대한 후기인지)
    trainerId: number
    trainerName: string
    sports: string // 종목
    endedAt: string // 수업 종료일 (YYYY.MM.DD)
}

// TODO: 매칭 성사 API 나오면 이 더미를 실제 fetch 결과로 교체
const DUMMY_TARGETS: WritableTarget[] = [
    {
        matchingId: 101,
        trainerId: 11,
        trainerName: '이민수 트레이너',
        sports: '웨이트 트레이닝',
        endedAt: '2024.05.20',
    },
    {
        matchingId: 102,
        trainerId: 12,
        trainerName: '박서연 코치',
        sports: '요가 & 필라테스',
        endedAt: '2024.05.15',
    },
]

// 별점 입력 (머티리얼 아이콘, 클릭으로 선택)
function StarInput({
                       rating,
                       onChange,
                   }: {
    rating: number
    onChange: (r: number) => void
}) {
    return (
        <div className="flex text-primary">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(i)}
                    className="material-symbols-outlined cursor-pointer text-[24px] transition-colors"
                    style={i <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                    star
                </button>
            ))}
        </div>
    )
}

// 트레이너 카드 한 장 (작성 폼이 카드 안에서 펼쳐짐)
function WritableCard({
                          target,
                          onSubmit,
                      }: {
    target: WritableTarget
    onSubmit: (target: WritableTarget, rating: number, content: string) => void
}) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(5)
    const [content, setContent] = useState('')

    const handleSubmit = () => {
        if (content.trim().length < 10) {
            alert('후기는 최소 10자 이상 입력해주세요.')
            return
        }
        onSubmit(target, rating, content)
    }

    return (
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            {/* 카드 상단: 트레이너 정보 + 작성하기 버튼 */}
            <div className="flex items-center justify-between p-md">
                <div className="flex items-center gap-md">
                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary-fixed to-primary-fixed-dim shadow-sm" />
                    <div className="flex flex-col gap-xs">
                        <h3 className="text-headline-sm font-headline-sm text-on-surface">
                            {target.trainerName}
                        </h3>
                        <div className="flex items-center gap-sm">
              <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-md font-label-bold text-on-secondary-container">
                {target.sports}
              </span>
                            <span className="text-body-sm text-on-surface-variant">
                {target.endedAt} 종료
              </span>
                        </div>
                    </div>
                </div>
                {open ? (
                    <button
                        disabled
                        className="cursor-default rounded-lg bg-surface-container-high px-md py-2 text-label-bold font-label-bold text-on-surface-variant"
                    >
                        작성 중
                    </button>
                ) : (
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg bg-primary px-md py-2 text-label-bold font-label-bold text-on-primary shadow-sm transition-all hover:scale-[0.98]"
                    >
                        작성하기
                    </button>
                )}
            </div>

            {/* 인라인 작성 폼 (펼쳐짐) */}
            {open && (
                <div className="border-t border-outline-variant bg-surface-container-low p-md">
                    <div className="mx-auto flex max-w-2xl flex-col gap-md">
                        {/* 별점 */}
                        <div className="flex items-center gap-md">
              <span className="text-label-bold font-label-bold text-on-surface">
                별점 선택
              </span>
                            <StarInput rating={rating} onChange={setRating} />
                        </div>

                        {/* 내용 */}
                        <div className="relative">
              <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="트레이너님과의 운동 경험을 공유해주세요. (최소 10자 이상)"
                  className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-body-md placeholder:text-outline-variant focus:border-primary focus:outline-none"
              />
                            <span className="absolute bottom-2 right-3 text-label-md text-on-surface-variant">
                {content.length} / 500
              </span>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end gap-sm">
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    setContent('')
                                    setRating(5)
                                }}
                                className="rounded-lg border-2 border-outline-variant px-md py-2 text-label-bold font-label-bold text-on-surface-variant transition-all hover:bg-surface-variant/20"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="rounded-lg bg-primary px-xl py-2 text-label-bold font-label-bold text-on-primary shadow-sm transition-all hover:scale-[0.98]"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function WritableReviewList() {
    const { user } = useAuth()

    // TODO: 매칭 성사 API 연동 시 useState + useEffect fetch 로 교체
    const [targets, setTargets] = useState<WritableTarget[]>(DUMMY_TARGETS)

    // 후기 등록 핸들러
    const handleSubmit = async (
        target: WritableTarget,
        rating: number,
        content: string,
    ) => {
        if (!user) return

        // 실제 후기 작성 API 호출 (이건 이미 구현된 POST /api/reviews 사용 가능)
        // TODO: 매칭 성사 API 연동 후, matchingId/trainerId 를 실제 값으로 전달
        //
        // const { error } = await apiClient.POST('/api/reviews', {
        //   headers: { Authorization: `Bearer ${user.token}` },
        //   body: {
        //     matchingId: target.matchingId,
        //     trainerId: target.trainerId,
        //     rating,
        //     content,
        //   },
        // })
        // if (error) { alert('후기 작성 실패'); return }

        // 데모: 등록되면 목록에서 제거
        alert(`[데모] ${target.trainerName}에게 후기 등록\n별점 ${rating} / ${content}`)
        setTargets((prev) => prev.filter((t) => t.matchingId !== target.matchingId))
    }

    // 빈 상태
    if (targets.length === 0) {
        return (
            <div className="mt-lg flex flex-col items-center gap-md rounded-xl border-2 border-dashed border-outline-variant p-xl opacity-40">
                <span className="material-symbols-outlined text-[48px]">history_edu</span>
                <p className="text-body-md font-label-bold">
                    더 이상 작성할 후기가 없습니다.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-md">
            {targets.map((target) => (
                <WritableCard
                    key={target.matchingId}
                    target={target}
                    onSubmit={handleSubmit}
                />
            ))}
        </div>
    )
}