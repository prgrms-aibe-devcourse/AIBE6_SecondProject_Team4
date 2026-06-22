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
        <fieldset className="mt-md">
            <legend className="text-label-md font-label-md text-on-surface-variant">
                선호 요일
            </legend>
            <div className="mt-xs grid grid-cols-4 gap-xs sm:grid-cols-7">
                {DAYS_OF_WEEK.map((day) => {
                    const selected = preferredTimes.some((time) => time.dayOfWeek === day)

                    return (
                        <button
                            key={day}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onToggle(day)}
                            className={`h-11 rounded-lg border text-body-sm font-label-bold transition-colors ${
                                selected
                                    ? 'border-primary bg-primary text-on-primary'
                                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'
                            }`}
                        >
                            {day.slice(0, 1)}
                        </button>
                    )
                })}
            </div>
            <p className="mt-xs text-body-sm text-on-surface-variant">
                시간은 트레이너를 선택한 뒤 레슨 요청 화면에서 정합니다.
            </p>
            {preferredTimes.length > 0 && (
                <p className="mt-xs text-body-sm font-label-bold text-primary">
                    선택: {preferredTimes.map((time) => time.dayOfWeek).join(', ')}
                </p>
            )}
        </fieldset>
    )
}
