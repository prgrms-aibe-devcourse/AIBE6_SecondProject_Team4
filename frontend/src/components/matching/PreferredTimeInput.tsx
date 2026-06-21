import { DAYS_OF_WEEK } from '@/constants/matchingOptions'

export type PreferredTime = {
    id: number
    dayOfWeek: string
    startTime: string
    endTime: string
}

type PreferredTimeInputProps = {
    dayOfWeek: string
    startTime: string
    endTime: string
    preferredTimes: PreferredTime[]
    onDayChange: (day: string) => void
    onStartTimeChange: (time: string) => void
    onEndTimeChange: (time: string) => void
    onAdd: () => void
    onRemove: (id: number) => void
}

export default function PreferredTimeInput({
    dayOfWeek,
    startTime,
    endTime,
    preferredTimes,
    onDayChange,
    onStartTimeChange,
    onEndTimeChange,
    onAdd,
    onRemove,
}: PreferredTimeInputProps) {
    return (
        <>
            <div className="mt-md grid grid-cols-1 sm:grid-cols-[150px_1fr_1fr_auto] gap-xs items-end">
                <label className="text-label-md font-label-md text-on-surface-variant">
                    요일
                    <select
                        value={dayOfWeek}
                        onChange={(event) => onDayChange(event.target.value)}
                        className="mt-xs w-full h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                    >
                        {DAYS_OF_WEEK.map((day) => (
                            <option key={day}>{day}</option>
                        ))}
                    </select>
                </label>

                <TimeSelect label="시작 시간" value={startTime} onChange={onStartTimeChange} />
                <TimeSelect label="종료 시간" value={endTime} onChange={onEndTimeChange} />

                <button
                    type="button"
                    onClick={onAdd}
                    className="h-11 px-sm rounded-lg bg-primary-fixed text-on-primary-fixed-variant font-label-bold hover:bg-primary-fixed-dim"
                >
                    + 추가
                </button>
            </div>

            <div className="mt-sm flex flex-wrap gap-xs min-h-8">
                {preferredTimes.map((time) => (
                    <span
                        key={time.id}
                        className="inline-flex items-center gap-xs rounded-full bg-surface-container px-sm py-xs text-body-sm text-on-surface-variant"
                    >
                        {time.dayOfWeek} {time.startTime} - {time.endTime}
                        <button
                            type="button"
                            onClick={() => onRemove(time.id)}
                            className="material-symbols-outlined text-base hover:text-error"
                            aria-label={`${time.dayOfWeek} 선호 시간 삭제`}
                        >
                            close
                        </button>
                    </span>
                ))}
            </div>
        </>
    )
}

type TimeSelectProps = {
    label: string
    value: string
    onChange: (time: string) => void
}

function TimeSelect({ label, value, onChange }: TimeSelectProps) {
    return (
        <label className="text-label-md font-label-md text-on-surface-variant">
            {label}
            <span className="relative mt-xs block">
                <input
                    type="time"
                    step="1800"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md text-on-surface outline-none transition-colors hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary-fixed"
                />
            </span>
        </label>
    )
}
