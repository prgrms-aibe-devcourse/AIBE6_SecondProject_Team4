import { DAYS_OF_WEEK } from '@/constants/matchingOptions'

export type PreferredTime = {
    id: number
    dayOfWeek: string
    startTime: string
    endTime: string
}

type PreferredTimeInputProps = {
    preferredTimes: PreferredTime[]
    onToggle: (day: string) => void
}

export default function PreferredTimeInput({ preferredTimes, onToggle }: PreferredTimeInputProps) {
    return (
        <fieldset className="mt-lg">
            <legend className="text-label-lg font-label-bold text-on-surface">
                선호 요일
            </legend>
            <div className="mt-sm grid grid-cols-4 gap-sm sm:grid-cols-7">
                {DAYS_OF_WEEK.map((day) => {
                    const selected = preferredTimes.some((time) => time.dayOfWeek === day)

                    return (
                        <button
                            key={day}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onToggle(day)}
                            className={`h-14 rounded-lg border text-body-md font-label-bold transition-all cursor-pointer ${
                                selected
                                    ? 'border-2 border-primary bg-primary-fixed/30 text-primary shadow-sm'
                                    : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-primary-fixed/10 hover:text-primary'
                            }`}
                        >
                            {day.slice(0, 1)}
                        </button>
                    )
                })}
            </div>
            <p className="mt-sm flex items-center gap-xs text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-primary">
                    schedule
                </span>
                시간은 트레이너를 선택한 뒤 레슨 요청 화면에서 정합니다.
            </p>
            {preferredTimes.length > 0 && (
                <div className="mt-sm flex flex-wrap items-center gap-xs">
                    <span className="text-label-md text-on-surface-variant">선택한 요일</span>
                    {preferredTimes.map((time) => (
                        <span
                            key={time.id}
                            className="rounded-full bg-primary-fixed px-sm py-1 text-label-md font-label-bold text-on-primary-fixed-variant"
                        >
                            {time.dayOfWeek}
                        </span>
                    ))}
                </div>
            )}
        </fieldset>
    )
}
